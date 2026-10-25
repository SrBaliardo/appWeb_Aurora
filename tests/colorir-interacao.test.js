import { lerFonteParaVM } from "./helpers/fonte-para-vm.js";
import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import * as regras from "../src/contexts/colorir/regras.js";
import {
  construirMapa,
  construirNomeArquivo,
  construirRegistro,
  lerAcoesSalvas,
} from "../src/contexts/colorir/builders/pintura.js";
import { LIMITE_TITULO } from "../src/contexts/colorir/constantes.js";

const fonte = lerFonteParaVM;
const tick = () => new Promise((resolve) => setImmediate(resolve));

test("fila real da fachada mantém revisões em ordem mesmo quando capturas terminam ao contrário", async () => {
  const capturas = [],
    gravados = [];
  const api = runInNewContext(
    `${fonte("src/contexts/colorir/index.js")}\nuseColorir()`,
    {
      construirCatalogo: () => [],
      PALETA: [],
      LIMITE_TITULO,
      construirRegistro,
      construirMapa() {},
      lerAcoesSalvas() {},
      aplicarAcao() {},
      regiaoNoPonto() {},
      restaurarPintura() {},
      normalizarTitulo: regras.normalizarTitulo,
      normalizarTituloEditado: regras.normalizarTituloEditado,
      construirNomeArquivo,
      arquivo: {
        capturarMiniatura: () =>
          new Promise((resolve) => capturas.push(resolve)),
        salvarPintura: async (r) => gravados.push(r),
      },
    },
  );
  const primeira = api.salvar("bosque-1", [{ cor: "vermelho" }], {}),
    segunda = api.salvar("bosque-1", [{ cor: "azul" }], {});
  capturas[1]("mini-azul");
  await tick();
  assert.equal(gravados.length, 0);
  capturas[0]("mini-vermelho");
  await Promise.all([primeira, segunda]);
  assert.deepEqual(
    gravados.map((r) => r.acoes[0].cor),
    ["vermelho", "azul"],
  );
  assert.deepEqual(
    gravados.map((r) => r.miniatura),
    ["mini-vermelho", "mini-azul"],
  );
});

test("fachada abre progresso v1 com máscara legada e salva v2 mantendo cores, título e ações antigas", async () => {
  const rgba = (ids) =>
    new Uint8ClampedArray(ids.flatMap((id) => [id, 0, 0, 255]));
  let registro = {
    id: "bosque-1",
    versao: 1,
    titulo: "Meu bosque",
    acoes: [{ tipo: "preencher", cor: "#0000ff", regiao: 1 }],
  };
  const pedidos = [];
  const api = runInNewContext(
    `${fonte("src/contexts/colorir/index.js")}\nuseColorir()`,
    {
      construirCatalogo: () => [],
      PALETA: [],
      LIMITE_TITULO,
      construirRegistro,
      construirNomeArquivo,
      construirMapa,
      lerAcoesSalvas,
      aplicarAcao: regras.aplicarAcao,
      regiaoNoPonto: regras.regiaoNoPonto,
      restaurarPintura: regras.restaurarPintura,
      normalizarTitulo: regras.normalizarTitulo,
      normalizarTituloEditado: regras.normalizarTituloEditado,
      arquivo: {
        carregarPintura: async () => registro,
        carregarDesenho: async (_pagina, _signal, opcoes) => {
          pedidos.push(opcoes.legado);
          return {
            largura: 4,
            altura: 1,
            pixels: rgba([10, 10, 20, 20]),
            cobertura: rgba([10, 10, 20, 20]),
            legado: opcoes.legado ? rgba([1, 0, 1, 1]) : undefined,
            imagem: { close() {} },
          };
        },
        capturarMiniatura: async () => null,
        salvarPintura: async (novo) => {
          registro = novo;
        },
      },
    },
  );
  const aberto = await api.abrirDesenho({ id: "bosque-1" });
  assert.equal(aberto.titulo, "Meu bosque");
  assert.equal(aberto.aviso, "");
  assert.equal(aberto.acoes[0].versaoMascara, 1);
  assert.deepEqual(
    [...aberto.pixels],
    [0, 0, 255, 255, 255, 255, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255],
  );
  const acoes = [
    ...aberto.acoes,
    { tipo: "preencher", cor: "#ff0000", regiao: 10, versaoMascara: 2 },
  ];
  await api.salvar("bosque-1", acoes, {}, aberto.titulo);
  assert.equal(registro.versao, 2);
  const volta = await api.abrirDesenho({ id: "bosque-1" });
  assert.equal(volta.titulo, "Meu bosque");
  assert.deepEqual(pedidos, [true, true]);
  assert.deepEqual(
    [...volta.pixels.slice(0, 8)],
    [255, 0, 0, 255, 255, 0, 0, 255],
  );
  assert.deepEqual([...volta.pixels.slice(8, 11)], [0, 0, 255]);
});

// Simulação dos hooks e APIs gráficas; não substitui interação no navegador.
function montarEditor({ falhar = false, carregamento, tituloSalvo = "" } = {}) {
  let indice = 0,
    versao = 0,
    api,
    proximo = 0,
    desenhos = 0,
    fechadas = 0;
  const slots = [],
    efeitos = [],
    timers = new Map(),
    frames = new Map(),
    gravados = [],
    downloads = [];
  const mapa = {
    versao: 2,
    largura: 1200,
    altura: 800,
    regioes: new Uint32Array(1200 * 800),
    indices: new Map([
      [1, []],
      [2, []],
    ]),
  };
  for (let i = 0; i < mapa.regioes.length; i++) {
    const id = i % 1200 < 600 ? 1 : 2;
    mapa.regioes[i] = id;
    mapa.indices.get(id).push(i);
  }
  let dados;
  const imagem = {
    close() {
      fechadas++;
    },
  };
  const dominio = {
    regiao: regras.regiaoNoPonto,
    aplicar: regras.aplicarAcao,
    restaurar: regras.restaurarPintura,
    normalizarTitulo: regras.normalizarTituloEditado,
    nomeArquivo: construirNomeArquivo,
    abrirDesenho:
      carregamento ||
      (async () => {
        dados = {
          mapa,
          imagem,
          acoes: [],
          titulo: tituloSalvo,
          pixels: regras.criarPapel(mapa),
          aviso: "",
        };
        return dados;
      }),
    exibir: () => {
      desenhos++;
    },
    salvar: async (id, acoes, _canvas, titulo) => {
      if (falhar) throw Error("quota");
      gravados.push({ id, titulo, acoes: structuredClone(acoes) });
    },
    baixar: async (_canvas, nome) => downloads.push(nome),
  };
  const canvas = {
    width: 1200,
    height: 800,
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: 1200,
      height: 800,
    }),
    getContext: () => ({
      save() {},
      restore() {},
      setLineDash() {},
      strokeRect() {},
    }),
  };
  const mesma = (a, b) =>
    a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const escopo = {
    useColorir: () => dominio,
    AbortController,
    console,
    useState(valor) {
      const i = indice++;
      slots[i] ??= { value: typeof valor === "function" ? valor() : valor };
      return [
        slots[i].value,
        (valor) => {
          const proximo =
            typeof valor === "function" ? valor(slots[i].value) : valor;
          if (!Object.is(proximo, slots[i].value)) versao++;
          slots[i].value = proximo;
        },
      ];
    },
    useRef(valor) {
      const i = indice++;
      slots[i] ??= { value: { current: valor } };
      return slots[i].value;
    },
    useCallback(fn, deps) {
      const i = indice++;
      if (!slots[i] || !mesma(slots[i].deps, deps)) slots[i] = { fn, deps };
      return slots[i].fn;
    },
    useEffect(fn, deps) {
      const i = indice++;
      if (!slots[i] || !mesma(slots[i].deps, deps))
        efeitos.push({ i, fn, deps });
    },
    setTimeout(fn) {
      const id = ++proximo;
      timers.set(id, fn);
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame(fn) {
      const id = ++proximo;
      frames.set(id, fn);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    window: { addEventListener() {}, removeEventListener() {} },
    document: { addEventListener() {}, removeEventListener() {} },
  };
  const hook = runInNewContext(
    `${fonte("src/pages/colorir/explorar/hooks/usePintura.js")}\nusePintura`,
    escopo,
  );
  const pagina = { id: "bosque-1" };
  function render() {
    let anterior,
      voltas = 0;
    do {
      assert.ok(voltas++ < 20, "efeito em ciclo");
      anterior = versao;
      indice = 0;
      api = hook(pagina, "Meu desenho 3");
      api.canvas.current = canvas;
      for (const { i, fn, deps } of efeitos.splice(0)) {
        slots[i]?.cleanup?.();
        slots[i] = { deps, cleanup: fn() };
      }
    } while (versao !== anterior);
    return api;
  }
  render();
  return {
    get api() {
      return api;
    },
    get dados() {
      return dados;
    },
    get gravados() {
      return gravados;
    },
    get desenhos() {
      return desenhos;
    },
    get fechadas() {
      return fechadas;
    },
    downloads,
    async pronto() {
      await tick();
      render();
    },
    act(fn) {
      fn(api);
      render();
    },
    async salvar() {
      await api.guardar();
      render();
    },
    falhar(v) {
      falhar = v;
    },
    async autoSalvar() {
      for (const [id, fn] of [...timers]) {
        timers.delete(id);
        fn();
      }
      await tick();
      render();
    },
    desmontar() {
      for (const slot of slots) slot?.cleanup?.();
      assert.equal(timers.size, 0);
      assert.equal(frames.size, 0);
    },
  };
}
function evento(x, y = 100, pointerId = 1) {
  return {
    button: 0,
    isPrimary: true,
    pointerId,
    clientX: x,
    clientY: y,
    preventDefault() {},
    currentTarget: { setPointerCapture() {} },
  };
}
test("editor pinta, salva automaticamente e desfaz; pincel ignora outro dedo e fica preso à região inicial", async () => {
  const h = montarEditor();
  await h.pronto();
  assert.equal(h.api.carregando, false);
  h.act((a) => a.setFerramenta("pincel"));
  h.act((a) => a.iniciar(evento(100)));
  h.act((a) => a.mover(evento(800)));
  await h.salvar();
  assert.equal(
    h.gravados.length,
    0,
    "não salva miniatura de um traço ainda incompleto",
  );
  const antes = h.dados.pixels[100 * 1200 * 4 + 800 * 4 + 1];
  assert.equal(antes, 255);
  h.act((a) => a.terminar(evento(800, 100, 2)));
  assert.equal(h.api.ocupado, true);
  h.act((a) => a.terminar(evento(800)));
  assert.equal(h.api.ocupado, false);
  assert.equal(h.dados.acoes.length, 1);
  await h.autoSalvar();
  assert.equal(h.gravados.length, 1);
  assert.equal(h.api.status, "Pintura salva neste aparelho!");
  assert.equal(h.gravados[0].acoes[0].regiao, 1);
  assert.ok(!("pointerId" in h.gravados[0].acoes[0]));
  h.act((a) => a.desfazer());
  assert.ok(h.dados.pixels.every((v) => v === 255));
  await h.salvar();
  assert.equal(h.gravados.at(-1).acoes.length, 0);
  h.desmontar();
  assert.equal(h.fechadas, 1);
  assert.ok(h.desenhos > 0);
});
test("falha no armazenamento mantém a pintura e permite repetir o salvamento", async () => {
  const h = montarEditor({ falhar: true });
  await h.pronto();
  h.act((a) => a.iniciar(evento(100)));
  await h.salvar();
  assert.match(h.api.status, /Não foi possível salvar/);
  assert.equal(h.dados.acoes.length, 1);
  h.falhar(false);
  await h.salvar();
  assert.equal(h.gravados.length, 1);
  h.desmontar();
});

test("saída explicitamente sem salvar não agenda outra gravação na desmontagem", async () => {
  const h = montarEditor();
  await h.pronto();
  h.act((a) => a.iniciar(evento(100)));
  h.api.descartarAoSair();
  h.desmontar();
  await tick();
  assert.equal(h.gravados.length, 0);
});
test("título confirmado persiste sem pinceladas e define o nome do PNG; título anterior é restaurado", async () => {
  const h = montarEditor();
  await h.pronto();
  assert.equal(h.api.titulo, "Meu desenho 3");
  await h.api.download();
  assert.equal(h.downloads.at(-1), "aurora_goodies-Meu desenho 3.png");
  h.act((a) => assert.equal(a.renomear("   "), false));
  assert.equal(h.api.titulo, "Meu desenho 3");
  h.act((a) => assert.equal(a.renomear(" Minha Aurora "), true));
  await h.salvar();
  assert.equal(h.gravados.at(-1).titulo, "Minha Aurora");
  assert.equal(h.gravados.at(-1).acoes.length, 0);
  await h.api.download();
  assert.equal(h.downloads.at(-1), "aurora_goodies-Minha Aurora.png");
  h.act((a) => a.limpar());
  assert.equal(h.api.titulo, "Minha Aurora");
  h.desmontar();
  const volta = montarEditor({ tituloSalvo: "Minha Aurora" });
  await volta.pronto();
  assert.equal(volta.api.titulo, "Minha Aurora");
  volta.desmontar();
});
test("carregamento concluído depois de sair libera a imagem sem atualizar o editor", async () => {
  let resolver,
    fechou = 0;
  const h = montarEditor({
    carregamento: () =>
      new Promise((resolve) => {
        resolver = resolve;
      }),
  });
  h.desmontar();
  resolver({
    imagem: {
      close() {
        fechou++;
      },
    },
  });
  await tick();
  assert.equal(fechou, 1);
});

test("carrossel percorre os três banners em cinco segundos e pausa por mouse ou foco", () => {
  const estados = [],
    efeitos = [],
    timers = new Map();
  let indice = 0,
    proximo = 0;
  const hook = runInNewContext(
    `${fonte("src/pages/inicio/explorar/hooks/useCarrossel.js")}\nuseCarrossel`,
    {
      useState(valor) {
        const i = indice++;
        estados[i] ??= { value: valor };
        return [
          estados[i].value,
          (v) => {
            estados[i].value =
              typeof v === "function" ? v(estados[i].value) : v;
          },
        ];
      },
      useEffect(fn, deps) {
        const i = indice++;
        if (
          !estados[i] ||
          deps.some((d, j) => !Object.is(d, estados[i].deps[j]))
        )
          efeitos.push({ i, fn, deps });
      },
      window: {
        setTimeout(fn, tempo) {
          assert.equal(tempo, 5000);
          const id = ++proximo;
          timers.set(id, fn);
          return id;
        },
        clearTimeout: (id) => timers.delete(id),
      },
    },
  );
  function render() {
    indice = 0;
    const api = hook();
    for (const { i, fn, deps } of efeitos.splice(0)) {
      estados[i]?.cleanup?.();
      estados[i] = { deps, cleanup: fn() };
    }
    return api;
  }
  let api = render();
  assert.equal(api.destaque, 0);
  for (const esperado of [1, 2, 0]) {
    const [id, fn] = [...timers][0];
    timers.delete(id);
    fn();
    api = render();
    assert.equal(api.destaque, esperado);
  }
  api.aoEntrarMouse();
  api = render();
  assert.equal(timers.size, 0);
  assert.equal(api.pausado, true);
  api.aoSairMouse();
  api = render();
  assert.equal(timers.size, 1);
  api.aoFocar();
  api = render();
  assert.equal(timers.size, 0);
  api.aoDesfocar({
    currentTarget: { contains: () => true },
    relatedTarget: {},
  });
  api = render();
  assert.equal(timers.size, 0);
  api.aoDesfocar({
    currentTarget: { contains: () => false },
    relatedTarget: null,
  });
  render();
  assert.equal(timers.size, 1);
  for (const estado of estados) estado?.cleanup?.();
  assert.equal(timers.size, 0);
});
