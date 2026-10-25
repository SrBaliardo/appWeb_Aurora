import { lerFonteParaVM } from "./helpers/fonte-para-vm.js";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transformSync } from "esbuild";
import * as jsx from "react/jsx-runtime";
import { Component } from "react";
import { LIMITE_TITULO, PALETA } from "../src/contexts/colorir/constantes.js";
import { useLivros } from "../src/contexts/livros/index.js";
import { useColorir } from "../src/contexts/colorir/index.js";

const fonte = lerFonteParaVM;
function montarHook(arquivo, nome, argumentos, extras = {}) {
  const slots = [],
    efeitos = [];
  let indice = 0;
  const igual = (a, b) =>
    a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const api = runInNewContext(`${fonte(arquivo)}\n${nome}`, {
    useState(valor) {
      const i = indice++;
      slots[i] ??= { value: typeof valor === "function" ? valor() : valor };
      return [
        slots[i].value,
        (novo) => {
          slots[i].value =
            typeof novo === "function" ? novo(slots[i].value) : novo;
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
      if (!slots[i] || !igual(slots[i].deps, deps)) slots[i] = { fn, deps };
      return slots[i].fn;
    },
    useEffect(fn, deps) {
      const i = indice++;
      if (!slots[i] || !igual(slots[i].deps, deps))
        efeitos.push({ i, fn, deps });
    },
    ...extras,
  });
  return {
    render() {
      indice = 0;
      const retorno = api(...argumentos());
      for (const { i, fn, deps } of efeitos.splice(0)) {
        slots[i]?.cleanup?.();
        slots[i] = { deps, cleanup: fn() };
      }
      return retorno;
    },
    desmontar() {
      slots.forEach((s) => s?.cleanup?.());
    },
  };
}
test("saída da pintura permite cancelar, baixar ou confirmar saída após falha e impede pedidos duplicados", async () => {
  let resolver,
    chamadas = 0,
    voltou = 0,
    descartou = 0,
    ocupado = false;
  const guardar = () => {
    chamadas++;
    return new Promise((resolve) => {
      resolver = resolve;
    });
  };
  const h = montarHook(
    "src/pages/colorir/explorar/hooks/useSaidaPintura.js",
    "useSaidaPintura",
    () => [guardar, () => voltou++, ocupado, () => descartou++],
  );
  let api = h.render();
  const primeira = api.sair();
  api = h.render();
  assert.equal(api.salvando, true);
  await api.sair();
  assert.equal(chamadas, 1);
  resolver(false);
  await primeira;
  api = h.render();
  assert.equal(api.confirmarSaida, true);
  assert.equal(voltou, 0);
  api.cancelarSaida();
  api = h.render();
  assert.equal(api.confirmarSaida, false);
  const segunda = api.sair();
  resolver(false);
  await segunda;
  api = h.render();
  api.sairSemSalvar();
  assert.equal(voltou, 1);
  assert.equal(descartou, 1);
  ocupado = true;
  api = h.render();
  await api.sair();
  assert.equal(chamadas, 2);
  api.sairSemSalvar();
  assert.equal(voltou, 1);
  ocupado = false;
  api = h.render();
  const terceira = api.sair();
  resolver(true);
  await terceira;
  assert.equal(voltou, 2);
  const quarta = api.sair();
  h.desmontar();
  resolver(true);
  await quarta;
  assert.equal(voltou, 2);
});

test("saída da pintura transforma rejeição inesperada em confirmação recuperável", async () => {
  const h = montarHook(
    "src/pages/colorir/explorar/hooks/useSaidaPintura.js",
    "useSaidaPintura",
    () => [
      async () => {
        throw new Error("Sem espaço");
      },
      () => assert.fail("Não deve sair sem confirmação"),
      false,
    ],
  );
  await h.render().sair();
  const api = h.render();
  assert.equal(api.confirmarSaida, true);
  assert.equal(api.salvando, false);
  h.desmontar();
});

test("menu da pintura aguarda salvamento e preserva o destino após falha, cancelamento e confirmação", async () => {
  let navegar,
    salvo = false,
    galeria = 0,
    destino = 0,
    descartou = 0;
  const registrar = (acao) => {
    navegar = acao;
  };
  const h = montarHook(
    "src/pages/colorir/explorar/hooks/useSaidaPintura.js",
    "useSaidaPintura",
    () => [
      async () => salvo,
      () => galeria++,
      false,
      () => descartou++,
      registrar,
    ],
  );
  let api = h.render();
  await navegar(() => destino++);
  api = h.render();
  assert.equal(api.confirmarSaida, true);
  assert.equal(destino, 0);
  salvo = true;
  await api.sair();
  assert.equal(destino, 1);
  assert.equal(galeria, 0);
  salvo = false;
  await navegar(() => destino++);
  api = h.render();
  api.cancelarSaida();
  api = h.render();
  salvo = true;
  await api.sair();
  assert.equal(galeria, 1);
  assert.equal(destino, 1);
  salvo = false;
  await navegar(() => destino++);
  api = h.render();
  api.sairSemSalvar();
  assert.equal(destino, 2);
  assert.equal(descartou, 1);
  h.desmontar();
  assert.equal(navegar, null);
});

test("cabeçalho intercepta somente navegação local normal e o modo pintura é limpo ao sair", async () => {
  const janela = {
    location: { hash: "#/colorir" },
    addEventListener() {},
    removeEventListener() {},
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
    scrollTo() {},
  };
  const h = montarHook(
    "src/app/hooks/useNavegacao.js",
    "useNavegacao",
    () => [],
    {
      window: janela,
      document: {},
      useInterface: () => ({ t: (texto) => texto }),
    },
  );
  const api = h.render();
  let continuar,
    impediu = 0;
  api.registrarAntesDeNavegar((acao) => {
    continuar = acao;
  });
  const clicar = (href, extras = {}) =>
    api.interceptarNavegacao({
      button: 0,
      target: { closest: () => ({ getAttribute: () => href }) },
      preventDefault() {
        impediu++;
      },
      ...extras,
    });
  clicar("#/memoria");
  assert.equal(janela.location.hash, "#/colorir");
  assert.equal(impediu, 1);
  continuar();
  assert.equal(janela.location.hash, "#/memoria");
  clicar("#/cores", { ctrlKey: true });
  clicar("#/cores", { metaKey: true });
  clicar("#/cores", { button: 1 });
  clicar("#/memoria");
  assert.equal(impediu, 1);
  api.registrarAntesDeNavegar(null);
  clicar("#/cores");
  assert.equal(impediu, 1);
  h.desmontar();
  const modos = [],
    timers = new Map();
  let id = 0;
  const callback = (modo) => modos.push(modo);
  const pintura = montarHook(
    "src/pages/colorir/explorar/hooks/useExplorarColorir.js",
    "useExplorarColorir",
    () => [callback],
    {
      requestAnimationFrame: (fn) => {
        timers.set(++id, fn);
        return id;
      },
      cancelAnimationFrame: (n) => timers.delete(n),
    },
  );
  let fluxo = pintura.render();
  assert.equal(modos.at(-1), false);
  fluxo.escolher({ id: "bosque-1" });
  fluxo = pintura.render();
  assert.equal(modos.at(-1), true);
  fluxo.voltarGaleria();
  pintura.render();
  assert.equal(modos.at(-1), false);
  fluxo.escolher({ id: "bosque-1" });
  pintura.render();
  pintura.desmontar();
  assert.equal(modos.at(-1), false);
  assert.equal(timers.size, 0);
});

test("edição do título cancela o rascunho, confirma uma vez e devolve foco ao lápis", () => {
  let titulo = "Meu desenho 3",
    salvou = 0,
    focou = 0;
  const h = montarHook(
    "src/pages/colorir/explorar/hooks/useEdicaoTitulo.js",
    "useEdicaoTitulo",
    () => [
      titulo,
      (valor) => {
        if (!valor.trim()) return false;
        titulo = valor.trim();
        return true;
      },
      () => salvou++,
      LIMITE_TITULO,
    ],
    {
      window: {
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle: () => ({
          fontWeight: "800",
          fontSize: "30px",
          fontFamily: "sans-serif",
        }),
      },
      document: {
        createElement: () => ({
          getContext: () => ({
            measureText: (texto) => ({
              width: [...texto].reduce(
                (total, letra) => total + (letra === "W" ? 20 : 9),
                0,
              ),
            }),
          }),
        }),
      },
    },
  );
  let api = h.render();
  api.lapis.current = {
    focus() {
      focou++;
    },
  };
  api.campo.current = {};
  function alterar(valor) {
    api.alterar({ target: { value: valor }, currentTarget: {} });
    api = h.render();
  }
  api.editar();
  api = h.render();
  api = h.render();
  assert.equal(api.rascunho, "Meu desenho 3");
  assert.equal(api.largura, 215);
  alterar("Descartar");
  api.cancelar();
  api = h.render();
  assert.equal(titulo, "Meu desenho 3");
  assert.equal(salvou, 0);
  assert.equal(focou, 1);
  api.editar();
  api = h.render();
  alterar("");
  api.confirmar({ preventDefault() {} });
  api = h.render();
  assert.equal(api.invalido, true);
  assert.equal(api.editando, true);
  alterar("a".repeat(41));
  api = h.render();
  assert.equal(api.rascunho.length, 40);
  assert.equal(api.largura, 360);
  alterar("W".repeat(40));
  assert.equal(api.rascunho, "a".repeat(40));
  alterar("W".repeat(39));
  assert.equal(api.rascunho, "a".repeat(40));
  alterar("Aurora no bosque");
  api.confirmar({ preventDefault() {} });
  api = h.render();
  assert.equal(titulo, "Aurora no bosque");
  assert.equal(salvou, 1);
  assert.equal(api.editando, false);
  assert.equal(focou, 2);
  titulo = "z".repeat(50);
  api = h.render();
  api.editar();
  api = h.render();
  assert.equal(api.rascunho.length, 40);
  api.cancelar();
  h.render();
  assert.equal(titulo.length, 50);
  h.desmontar();
});
test("moldura cabe no espaço medido sem distorcer a proporção, inclusive depois de montar no portal", () => {
  let ampliado = false,
    largura = 800,
    altura = 460,
    observer,
    desconectou = 0;
  const h = montarHook(
    "src/pages/colorir/explorar/hooks/useMolduraColorir.js",
    "useMolduraColorir",
    () => [ampliado],
    {
      window: { addEventListener() {}, removeEventListener() {} },
      ResizeObserver: class {
        constructor(fn) {
          observer = fn;
        }
        observe() {}
        disconnect() {
          desconectou++;
        }
      },
    },
  );
  let api = h.render();
  assert.equal(api.largura, 0);
  api.palco({
    getBoundingClientRect: () => ({ width: largura, height: altura }),
  });
  h.render();
  api = h.render();
  assert.ok(api.largura > 0);
  for (const [w, he] of [
    [1200, 700],
    [750, 380],
    [340, 180],
    [210, 120],
  ]) {
    largura = w;
    altura = he;
    observer();
    api = h.render();
    assert.ok(api.largura + 16 <= w);
    assert.ok(api.largura / 1.5 + 16 <= he);
    const antes = api.largura;
    ampliado = true;
    h.render();
    api = h.render();
    assert.ok(api.largura >= antes);
    assert.ok(api.largura + 16 <= w);
    assert.ok(api.largura / 1.5 + 16 <= he);
    ampliado = false;
    h.render();
  }
  h.desmontar();
  assert.ok(desconectou > 0);
});
function componente(arquivo, resolver, globais = {}) {
  const module = { exports: {} },
    texto = readFileSync(arquivo, "utf8");
  const estilos = Object.fromEntries(
    [...texto.matchAll(/\bS\.(\w+)/g)].map((m) => [m[1], m[1]]),
  );
  runInNewContext(
    transformSync(texto, { loader: "jsx", format: "cjs", jsx: "automatic" })
      .code,
    {
      module,
      exports: module.exports,
      ...globais,
      require: (id) =>
        id === "react/jsx-runtime"
          ? jsx
          : id === "./styles"
            ? estilos
            : resolver(id),
    },
  );
  return module.exports.default;
}
function elementos(raiz) {
  if (!raiz || typeof raiz !== "object") return [];
  const filhos = [raiz.props?.children].flat(Infinity);
  return [raiz, ...filhos.flatMap(elementos)];
}

test("falha de página oferece recuperação e retorno ao início sem impedir a navegação do shell", () => {
  let recarregou = 0;
  const Limite = componente(
    "src/app/components/LimitePagina/index.jsx",
    (id) =>
      id === "react"
        ? { Component }
        : { useInterface: () => ({ t: (texto) => texto }) },
    {
      window: {
        location: {
          reload() {
            recarregou++;
          },
        },
      },
    },
  );
  const instancia = new Limite({ children: "aventura" });
  assert.equal(instancia.render(), "aventura");
  instancia.state = Limite.getDerivedStateFromError(
    new Error("Chunk indisponível"),
  );
  const falha = instancia.render(),
    painel = falha.type(),
    itens = elementos(painel);
  assert.equal(painel.props.role, "alert");
  itens.find((item) => item.type === "Botao").props.onClick();
  assert.equal(recarregou, 1);
  assert.equal(itens.find((item) => item.type === "Inicio").props.href, "#/");
  assert.equal(
    new Limite({ children: "outra aventura" }).render(),
    "outra aventura",
  );
});
test("editor agrupa ferramentas e ações, não mostra salvar nem modo de teclado e usa lápis/X/check", () => {
  let editando = false;
  const jogo = {
    titulo: "Meu desenho 3",
    canvas: { current: null },
    carregando: false,
    ocupado: false,
    podeDesfazer: true,
    cor: "#497be8",
    ferramenta: "pincel",
  };
  const Editor = componente(
    "src/pages/colorir/explorar/components/EditorColorir/index.jsx",
    (id) => {
      if (id === "react") return { useState: (v) => [v, () => {}] };
      if (id.includes("contexts/interface"))
        return { useInterface: () => ({ t: (t) => t }) };
      if (id.includes("contexts/colorir"))
        return {
          useColorir: () => ({ paleta: PALETA, limiteTitulo: LIMITE_TITULO }),
        };
      if (id.includes("usePintura")) return { usePintura: () => jogo };
      if (id.includes("useEdicaoTitulo"))
        return { useEdicaoTitulo: () => ({ editando, rascunho: jogo.titulo }) };
      if (id.includes("useSaidaPintura"))
        return {
          useSaidaPintura: () => ({ confirmarSaida: false, salvando: false }),
        };
      if (id.includes("useMolduraColorir"))
        return { useMolduraColorir: () => ({ largura: 700 }) };
      return {
        __esModule: true,
        default: id.includes("Icone") ? "icone" : "outro",
      };
    },
  );
  for (editando of [false, true]) {
    const raiz = Editor({ pagina: { numero: 3 } }),
      todos = elementos(raiz);
    assert.equal(raiz.type, "Enquadramento");
    assert.equal(raiz.props.fullScreen, undefined);
    assert.equal(raiz.props["aria-labelledby"], "titulo-pintura");
    const ferramentas = todos.find((e) => e.type === "Ferramentas");
    assert.equal(ferramentas.props.children.length, 2);
    assert.deepEqual(
      [...ferramentas.props.children].map((e) => e.props.children.props.nome),
      ["balde", "pincel"],
    );
    const acoes = todos.find((e) => e.type === "Acoes");
    assert.deepEqual(
      [...acoes.props.children].map((e) => e.props["aria-label"]),
      ["Baixar", "Ampliar", "Recomeçar"],
    );
    assert.ok(
      !todos.some(
        (e) =>
          e.props?.children === "Salvar pintura" ||
          e.props?.children === "Colorir com o teclado",
      ),
    );
    const nomes = todos
      .filter((e) => e.type === "icone")
      .map((e) => e.props.nome);
    assert.equal(nomes.includes("lapis"), !editando);
    assert.equal(nomes.includes("fechar"), editando);
    assert.equal(nomes.includes("check"), editando);
    if (editando)
      assert.equal(todos.find((e) => e.type === "Campo").props.maxLength, 40);
  }
});
test("coleções têm seis cards, cinco cadeados e ações do Bosque ligadas à leitura ou à pintura", () => {
  for (const tipo of ["livros", "colorir"]) {
    let abriu = 0;
    const abrir = () => abriu++;
    const Pagina = componente(`src/pages/${tipo}/explorar/index.jsx`, (id) => {
      if (id.includes("contexts/interface"))
        return {
          useInterface: () => ({
            t: (t, v) => (v ? t.replace(/\{(\w+)\}/g, (_, k) => v[k]) : t),
          }),
        };
      if (id.includes("contexts/livros")) return { useLivros };
      if (id.includes("contexts/colorir")) return { useColorir };
      if (id.includes("useLeitura"))
        return { useLeitura: () => ({ abrir, aberto: false }) };
      if (id.includes("useExplorarColorir"))
        return {
          useExplorarColorir: () => ({ tela: "colecao", abrirLivro: abrir }),
        };
      return {
        __esModule: true,
        default: id.includes("BotaoBloqueado") ? "bloqueado" : "outro",
      };
    });
    const todos = elementos(Pagina()),
      cards = todos.filter((e) => e.type === "Livro");
    assert.equal(cards.length, 6);
    assert.equal(todos.filter((e) => e.type === "bloqueado").length, 5);
    const gratuito = elementos(cards[0]).find((e) => e.type === "Botao");
    gratuito.props.onClick();
    assert.equal(abriu, 1);
    if (tipo === "livros") {
      assert.equal(gratuito.props.children, "Vamos ler");
      assert.equal(gratuito.props.startIcon, undefined);
    }
    const acoes = todos.find((e) => e.type === "Acoes");
    assert.equal(acoes.props.children.length, 2);
    assert.equal(acoes.props.children[0].props.onClick, abrir);
    if (tipo === "livros") {
      assert.equal(acoes.props.children[0].props.children, "Ler agora");
      assert.ok(acoes.props.children[0].props.startIcon);
    }
    assert.equal(acoes.props.children[1].type, "Download");
    assert.equal(acoes.props.children[1].props.download, true);
    assert.ok(acoes.props.children[1].props.href.endsWith(".pdf"));
    assert.ok(
      todos.some(
        (e) =>
          e.type === "Formato" &&
          e.props.children.includes(tipo === "livros" ? "58" : "42"),
      ),
    );
  }
});

test("abrir páginas e telas de colorir não força foco em títulos; pular para conteúdo continua explícito", () => {
  for (const tipo of ["navegacao", "colorir"]) {
    let rolou = 0,
      focou = 0,
      proximo = 0;
    const frames = new Map(),
      listeners = new Map();
    const agendar = (fn) => {
      const id = ++proximo;
      frames.set(id, fn);
      return id;
    };
    const cancelar = (id) => frames.delete(id);
    const janela = {
      location: { hash: "#/" },
      addEventListener: (nome, fn) => listeners.set(nome, fn),
      removeEventListener: (nome) => listeners.delete(nome),
      requestAnimationFrame: agendar,
      cancelAnimationFrame: cancelar,
      scrollTo: () => rolou++,
    };
    const documento = {
      querySelector() {
        throw Error("Não deve procurar um título para focar");
      },
      getElementById: () => ({ focus: () => focou++ }),
    };
    const caminho =
      tipo === "navegacao"
        ? "src/app/hooks/useNavegacao.js"
        : "src/pages/colorir/explorar/hooks/useExplorarColorir.js";
    const h = montarHook(
      caminho,
      tipo === "navegacao" ? "useNavegacao" : "useExplorarColorir",
      () => [],
      {
        window: janela,
        document: documento,
        requestAnimationFrame: agendar,
        cancelAnimationFrame: cancelar,
        useInterface: () => ({ t: (texto) => texto }),
      },
    );
    let api = h.render();
    assert.equal(focou, 0);
    if (tipo === "navegacao") {
      janela.location.hash = "#/livros";
      listeners.get("hashchange")();
    } else api.abrirLivro();
    api = h.render();
    for (const [id, fn] of [...frames]) {
      frames.delete(id);
      fn();
    }
    assert.equal(rolou, 1);
    assert.equal(focou, 0);
    if (tipo === "navegacao") {
      api.pularConteudo({ preventDefault() {} });
      assert.equal(focou, 1);
    }
    h.desmontar();
    assert.equal(frames.size, 0);
  }
});
