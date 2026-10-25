import { lerFonteParaVM } from "./helpers/fonte-para-vm.js";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transformSync } from "esbuild";
import * as jsx from "react/jsx-runtime";

function montar({ largura = 300, conteudo = 1200 } = {}) {
  const slots = [],
    efeitos = [],
    frames = new Map(),
    timers = new Map(),
    eventos = new Map(),
    eventosJanela = new Map();
  let indice = 0,
    id = 0,
    observar,
    desconectou = 0,
    idioma = "pt-BR",
    api;
  const nav = {
    scrollLeft: 0,
    clientWidth: largura,
    scrollWidth: conteudo,
    addEventListener: (tipo, fn) => eventos.set(tipo, fn),
    removeEventListener: (tipo) => eventos.delete(tipo),
  };
  const igual = (a, b) =>
    a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const fonte = lerFonteParaVM("src/app/hooks/useRolagemMenu.js");
  const hook = runInNewContext(`${fonte}\nuseRolagemMenu`, {
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
      constructor(fn) {
        observar = fn;
      }
      observe() {}
      disconnect() {
        desconectou++;
      }
    },
    window: {
      requestAnimationFrame: (fn) => {
        frames.set(++id, fn);
        return id;
      },
      cancelAnimationFrame: (n) => frames.delete(n),
      setTimeout: (fn, ms) => {
        assert.equal(ms, 150);
        timers.set(++id, fn);
        return id;
      },
      clearTimeout: (n) => timers.delete(n),
      addEventListener: (tipo, fn) => eventosJanela.set(tipo, fn),
      removeEventListener: (tipo) => eventosJanela.delete(tipo),
    },
  });
  function render() {
    indice = 0;
    api = hook(idioma);
    api.menu.current = nav;
    api.itens.current = {};
    for (const { i, fn, deps } of efeitos.splice(0)) {
      slots[i]?.cleanup?.();
      slots[i] = { deps, cleanup: fn() };
    }
    return api;
  }
  render();
  render();
  return {
    nav,
    get api() {
      return api;
    },
    render,
    frames,
    timers,
    rolar(valor) {
      nav.scrollLeft = valor;
      eventos.get("scroll")();
    },
    medir() {
      observar();
    },
    trocarIdioma(valor) {
      idioma = valor;
      render();
      render();
    },
    quadro() {
      for (const [n, fn] of [...frames]) {
        frames.delete(n);
        fn();
      }
      render();
    },
    parar() {
      for (const [n, fn] of [...timers]) {
        timers.delete(n);
        fn();
      }
      render();
    },
    desmontar() {
      slots.forEach((slot) => slot?.cleanup?.());
      assert.equal(frames.size, 0);
      assert.equal(timers.size, 0);
      assert.equal(eventos.size, 0);
      assert.equal(eventosJanela.size, 0);
      assert.ok(desconectou > 0);
    },
  };
}

test("joaninha acompanha rolagem nativa, direção e pausa; toque/trackpad não dependem do range", () => {
  const h = montar();
  assert.equal(h.api.visivel, true);
  assert.equal(h.api.progresso, 0);
  h.rolar(450);
  h.rolar(600);
  assert.equal(h.frames.size, 1);
  h.quadro();
  assert.equal(h.api.progresso, 2 / 3);
  assert.equal(h.api.direcao, 1);
  assert.equal(h.api.andando, true);
  h.rolar(300);
  h.quadro();
  assert.equal(h.api.direcao, -1);
  assert.equal(h.timers.size, 1);
  h.parar();
  assert.equal(h.api.andando, false);
  h.rolar(9999);
  h.quadro();
  assert.equal(h.api.progresso, 1);
  h.rolar(-20);
  h.quadro();
  assert.equal(h.api.progresso, 0);
  h.desmontar();
});

test("range sincroniza imediatamente com o menu, limita os extremos e limpa frames pendentes", () => {
  const h = montar();
  h.rolar(100);
  assert.equal(h.frames.size, 1);
  h.api.mover({ currentTarget: { value: "50" } });
  h.render();
  assert.equal(h.nav.scrollLeft, 450);
  assert.equal(h.api.progresso, 0.5);
  h.api.mover({ currentTarget: { value: "120" } });
  h.render();
  assert.equal(h.nav.scrollLeft, 900);
  h.api.mover({ currentTarget: { value: "-10" } });
  h.render();
  assert.equal(h.nav.scrollLeft, 0);
  h.api.mover({ currentTarget: { value: "inválido" } });
  assert.equal(h.nav.scrollLeft, 0);
  h.desmontar();
});

test("trilha aparece somente com overflow e mede novamente após resize e idioma sem animação presa", () => {
  const h = montar({ largura: 500, conteudo: 400 });
  assert.equal(h.api.visivel, false);
  h.nav.scrollWidth = 1500;
  h.medir();
  h.quadro();
  assert.equal(h.api.visivel, true);
  h.rolar(400);
  h.quadro();
  assert.equal(h.api.andando, true);
  h.trocarIdioma("es-ES");
  assert.equal(h.api.andando, false);
  assert.equal(h.api.progresso, 0.4);
  h.nav.clientWidth = 1600;
  h.nav.scrollLeft = 0;
  h.medir();
  h.quadro();
  assert.equal(h.api.visivel, false);
  assert.equal(h.api.progresso, 0);
  h.desmontar();
});

function elementos(raiz) {
  return !raiz || typeof raiz !== "object"
    ? []
    : [raiz, ...[raiz.props?.children].flat(Infinity).flatMap(elementos)];
}
test("controle usa range nativo acessível, IDs exclusivos, legenda e estado visual coerentes", () => {
  const texto = readFileSync("src/app/components/MenuBosque/index.jsx", "utf8"),
    module = { exports: {} };
  const estilos = Object.fromEntries(
    [...texto.matchAll(/\bS\.(\w+)/g)].map((m) => [m[1], m[1]]),
  );
  let id = 0,
    visivel = true;
  runInNewContext(
    transformSync(texto, { loader: "jsx", format: "cjs", jsx: "automatic" })
      .code,
    {
      module,
      exports: module.exports,
      require: (nome) =>
        nome === "react/jsx-runtime"
          ? jsx
          : nome === "react"
            ? { useId: () => `:id${++id}:` }
            : nome === "./styles"
              ? estilos
              : nome.includes("TrilhoBosque")
                ? { __esModule: true, default: "TrilhoBosque" }
                : nome.includes("useRolagemMenu")
                  ? {
                      useRolagemMenu: () => ({
                        visivel,
                        progresso: 0.375,
                        direcao: -1,
                        andando: true,
                      }),
                    }
                  : {
                      useInterface: () => ({
                        idiomaInterface: "pt-BR",
                        t: (s, valores) => s.replace("{valor}", valores?.valor),
                      }),
                    },
    },
  );
  const Menu = module.exports.default;
  const primeira = elementos(Menu({ children: "links" })),
    segunda = elementos(Menu({ children: "links" }));
  const trilho = primeira.find((e) => e.type === "TrilhoBosque"),
    nav = primeira.find((e) => e.type === "Nav");
  assert.equal(trilho.props.progresso, 0.375);
  assert.equal(trilho.props.telaInteira, true);
  assert.equal(trilho.props.rotulo, "Movimentar o menu");
  assert.equal(trilho.props.valorAcessivel, "Posi??o do menu: 38%");
  assert.equal(trilho.props.controleId, nav.props.id);
  assert.notEqual(nav.props.id, segunda.find((e) => e.type === "Nav").props.id);
  assert.equal(trilho.props.direcao, -1);
  visivel = false;
  assert.ok(!elementos(Menu({})).some((e) => e.type === "TrilhoBosque"));
});
