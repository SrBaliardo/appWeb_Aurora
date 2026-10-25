import { lerFonteParaVM } from "./helpers/fonte-para-vm.js";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transformSync } from "esbuild";
import * as jsx from "react/jsx-runtime";

function elemento(opcoes = {}) {
  const atributos = new Map();
  const propriedades = new Map();
  return {
    scrollTop: 0,
    scrollLeft: 0,
    clientHeight: 300,
    clientWidth: 400,
    scrollHeight: 300,
    scrollWidth: 400,
    isConnected: true,
    id: "",
    style: {
      getPropertyValue: (nome) => propriedades.get(nome) || "",
      setProperty: (nome, valor) => propriedades.set(nome, valor),
      removeProperty: (nome) => propriedades.delete(nome),
    },
    estilo: {
      overflow: "auto",
      overflowX: "auto",
      overflowY: "auto",
      visibility: "visible",
      display: "block",
    },
    getAttribute: (nome) => atributos.get(nome) ?? null,
    hasAttribute: (nome) => atributos.has(nome),
    removeAttribute: (nome) => atributos.delete(nome),
    toggleAttribute(nome, habilitar) {
      if (habilitar) atributos.set(nome, "");
      else atributos.delete(nome);
    },
    getBoundingClientRect: () => ({
      top: 50,
      left: 100,
      right: 500,
      bottom: 350,
    }),
    closest(seletor) {
      return seletor === ".MuiDialog-paper"
        ? this.paper || null
        : this.inativo
          ? {}
          : null;
    },
    scrollTo({ top, left }) {
      this.scrollTop = top;
      this.scrollLeft = left;
    },
    ...opcoes,
  };
}
function montar() {
  const raiz = elemento({
    clientHeight: 800,
    clientWidth: 1200,
    scrollHeight: 1800,
    scrollWidth: 1200,
  });
  const corpo = elemento(),
    alvos = [],
    slots = [],
    efeitos = [],
    frames = new Map(),
    timers = new Map(),
    eventos = new Map(),
    janela = new Map(),
    visual = new Map();
  let indice = 0,
    proximo = 0,
    agora = 0,
    api,
    mutacao;
  const topo = { cabecalho: null, trilho: null };
  const igual = (a, b) =>
    a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const fonte = lerFonteParaVM("src/hooks/useRolagensBosque.js");
  const hook = runInNewContext(`${fonte}\nuseRolagensBosque`, {
    Date: { now: () => agora },
    useState(valor) {
      const i = indice++;
      slots[i] ??= { value: valor };
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
    useEffect(fn, deps) {
      const i = indice++;
      if (!slots[i] || !igual(slots[i].deps, deps))
        efeitos.push({ i, fn, deps });
    },
    ResizeObserver: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    MutationObserver: class {
      constructor(fn) {
        mutacao = fn;
      }
      observe() {}
      disconnect() {}
    },
    document: {
      body: corpo,
      scrollingElement: raiz,
      documentElement: raiz,
      querySelector: (seletor) =>
        seletor === "[data-cabecalho-bosque]" ? topo.cabecalho : topo.trilho,
      querySelectorAll: () => alvos,
      getElementById: () => null,
      addEventListener: (n, fn) => eventos.set(n, fn),
      removeEventListener: (n) => eventos.delete(n),
    },
    window: {
      innerHeight: 800,
      getComputedStyle: (alvo) => alvo.estilo,
      requestAnimationFrame: (fn) => {
        frames.set(++proximo, fn);
        return proximo;
      },
      cancelAnimationFrame: (n) => frames.delete(n),
      setTimeout: (fn) => {
        timers.set(++proximo, fn);
        return proximo;
      },
      clearTimeout: (n) => timers.delete(n),
      addEventListener: (n, fn) => janela.set(n, fn),
      removeEventListener: (n) => janela.delete(n),
      visualViewport: {
        addEventListener: (n, fn) => visual.set(n, fn),
        removeEventListener: (n) => visual.delete(n),
      },
    },
  });
  function render() {
    indice = 0;
    api = hook();
    for (const { i, fn, deps } of efeitos.splice(0)) {
      slots[i]?.cleanup?.();
      slots[i] = { deps, cleanup: fn() };
    }
    return api;
  }
  render();
  render();
  function quadro() {
    for (const [n, fn] of [...frames]) {
      frames.delete(n);
      fn();
    }
    render();
  }
  return {
    raiz,
    corpo,
    alvos,
    topo,
    get api() {
      return api;
    },
    render,
    medir() {
      janela.get("resize")();
      quadro();
    },
    rolar() {
      eventos.get("scroll")();
      quadro();
    },
    parar() {
      agora += 151;
      for (const [n, fn] of [...timers]) {
        timers.delete(n);
        fn();
      }
      quadro();
    },
    mutacao(evento) {
      mutacao([evento]);
    },
    frames,
    desmontar() {
      slots.forEach((s) => s?.cleanup?.());
      assert.equal(frames.size, 0);
      assert.equal(timers.size, 0);
      assert.equal(eventos.size, 0);
      assert.equal(janela.size, 0);
      assert.equal(visual.size, 0);
    },
  };
}

test("página usa joaninha vertical, acompanha mouse/teclado, limita extremos e encerra animação", () => {
  const h = montar();
  assert.equal(h.api.barras.length, 1);
  const barra = h.api.barras[0];
  assert.equal(barra.vertical, true);
  assert.equal(barra.left, 1156);
  assert.equal(barra.comprimento, 800);
  h.api.mover(h.raiz, true, 50);
  h.render();
  assert.equal(h.raiz.scrollTop, 500);
  assert.equal(h.api.barras[0].progresso, 0.5);
  assert.equal(h.api.barras[0].andando, true);
  h.raiz.scrollTop = 200;
  h.rolar();
  assert.equal(h.api.barras[0].direcao, -1);
  h.parar();
  assert.equal(h.api.barras[0].andando, false);
  h.api.mover(h.raiz, true, 200);
  assert.equal(h.raiz.scrollTop, 1000);
  h.api.mover(h.raiz, true, "inválido");
  assert.equal(h.raiz.scrollTop, 1000);
  h.desmontar();
  assert.equal(h.raiz.hasAttribute("data-rolagem-bosque-y"), false);
});

test("vertical começa abaixo do menu, liga os galhos sem invadir a área da joaninha horizontal e acompanha resize", () => {
  const h = montar();
  let fim = 160;
  h.topo.cabecalho = { getBoundingClientRect: () => ({ bottom: fim + 14 }) };
  h.topo.trilho = { getBoundingClientRect: () => ({ bottom: fim }) };
  h.medir();
  let barra = h.api.barras[0];
  assert.equal(barra.top, 160);
  assert.equal(barra.comprimento, 640);
  assert.equal(barra.prolongamento, 20);
  assert.equal(
    h.raiz.style.getPropertyValue("--altura-cabecalho-bosque"),
    "174px",
  );
  h.raiz.scrollTop = 900;
  h.rolar();
  assert.equal(h.api.barras[0].top, 160);
  fim = 120;
  h.medir();
  barra = h.api.barras[0];
  assert.equal(barra.top, 120);
  assert.equal(barra.comprimento, 680);
  h.topo.trilho = null;
  h.medir();
  assert.equal(h.api.barras[0].top, 134);
  assert.equal(h.api.barras[0].prolongamento, 0);
  h.desmontar();
  assert.equal(h.raiz.style.getPropertyValue("--altura-cabecalho-bosque"), "");
});

test("leitor com zoom recebe os dois eixos dentro do modal, sem mover o eixo oposto", () => {
  const h = montar(),
    paper = elemento(),
    leitor = elemento({ scrollWidth: 900, scrollHeight: 1000, paper });
  h.corpo.estilo.overflowY = "hidden";
  h.alvos.push(leitor);
  h.medir();
  assert.equal(h.api.barras.length, 2);
  assert.ok(h.api.barras.every((b) => b.portal === paper));
  assert.equal(h.raiz.hasAttribute("data-rolagem-bosque-y"), false);
  assert.equal(h.api.barras.find((b) => !b.vertical).comprimento, 356);
  h.api.mover(leitor, true, 50);
  h.api.mover(leitor, false, 100);
  h.render();
  assert.equal(leitor.scrollTop, 350);
  assert.equal(leitor.scrollLeft, 500);
  leitor.inativo = true;
  h.medir();
  assert.equal(h.api.barras.length, 0);
  assert.equal(leitor.hasAttribute("data-rolagem-bosque-y"), false);
  h.desmontar();
});

test("overflow desaparece após resize, alvos removidos são limpos e controles não criam ciclos de observação", () => {
  const h = montar(),
    paleta = elemento({ scrollHeight: 700 });
  h.alvos.push(paleta);
  h.medir();
  assert.equal(paleta.hasAttribute("data-rolagem-bosque-y"), true);
  h.mutacao({
    target: { closest: () => ({}) },
    addedNodes: [],
    removedNodes: [],
  });
  assert.equal(h.frames.size, 0);
  h.alvos.length = 0;
  h.raiz.scrollHeight = 800;
  h.medir();
  assert.equal(h.api.barras.length, 0);
  assert.equal(paleta.hasAttribute("data-rolagem-bosque-y"), false);
  h.desmontar();
});

function componente(arquivo, resolver, globais = {}) {
  const texto = readFileSync(arquivo, "utf8"),
    module = { exports: {} };
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
function elementos(no) {
  return !no || typeof no !== "object"
    ? []
    : [no, ...[no.props?.children].flat(Infinity).flatMap(elementos)];
}
test("trilho vertical mantém range acessível e usa setas/Home/End sem acionar navegação de modais", () => {
  const Trilho = componente("src/components/TrilhoBosque/index.jsx", (id) =>
    id === "react"
      ? { useId: () => ":trilho:" }
      : { __esModule: true, default: "arte" },
  );
  let valor,
    impediu = 0,
    parou = 0;
  const arvore = Trilho({
    vertical: true,
    comprimento: 500,
    progresso: 0.5,
    direcao: 1,
    rotulo: "Rolagem vertical",
    mover: (e) => {
      valor = Number(e.currentTarget.value);
    },
  });
  const controle = elementos(arvore).find((e) => e.type === "Controle");
  assert.equal(controle.props.type, "range");
  assert.equal(controle.props["aria-orientation"], "vertical");
  assert.equal(controle.props.value, 50);
  for (const [key, esperado] of [
    ["ArrowDown", 51],
    ["ArrowUp", 49],
    ["PageDown", 60],
    ["Home", 0],
    ["End", 100],
  ]) {
    controle.props.onKeyDown({
      key,
      preventDefault() {
        impediu++;
      },
      stopPropagation() {
        parou++;
      },
    });
    assert.equal(valor, esperado);
  }
  controle.props.onKeyDown({ key: "Escape" });
  assert.equal(impediu, 5);
  assert.equal(parou, 5);
  const Inseto = componente(
    "src/components/TrilhoBosque/Inseto.jsx",
    () => ({}),
  );
  assert.ok(
    elementos(Inseto({ id: "vertical" })).some(
      (e) => e.props.className === "pernas-a",
    ),
  );
  assert.ok(
    elementos(Inseto({ id: "a" })).some(
      (e) => e.props.className === "pernas-a",
    ),
  );
});

test("portal de rolagem preserva Escape do modal e não mostra controles durante loading global", () => {
  let carregando = false,
    recebeu,
    parou = 0;
  const modal = {
    dispatchEvent: (evento) => {
      recebeu = evento;
    },
  };
  const alvo = { closest: () => modal, id: "leitor" };
  const Rolagens = componente(
    "src/components/RolagensBosque/index.jsx",
    (id) => {
      if (id === "react-dom") return { createPortal: (no) => no };
      if (id.includes("useRolagensBosque"))
        return {
          useRolagensBosque: () => ({
            barras: [
              {
                alvo,
                portal: {},
                vertical: true,
                rotulo: "Livro",
                progresso: 0.5,
              },
            ],
            mover() {},
          }),
        };
      if (id.includes("contexts/interface"))
        return { useInterface: () => ({ t: (s) => s, carregando }) };
      return { __esModule: true, default: "trilho" };
    },
    {
      KeyboardEvent: class {
        constructor(tipo, opcoes) {
          this.type = tipo;
          Object.assign(this, opcoes);
        }
      },
    },
  );
  const posicao = Rolagens()[0];
  posicao.props.onKeyDown({
    key: "Escape",
    stopPropagation() {
      parou++;
    },
  });
  assert.equal(parou, 1);
  assert.equal(recebeu.type, "keydown");
  assert.equal(recebeu.key, "Escape");
  assert.equal(recebeu.bubbles, true);
  carregando = true;
  assert.equal(Rolagens(), null);
});
