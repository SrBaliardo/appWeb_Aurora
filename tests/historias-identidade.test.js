import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transformSync } from "esbuild";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { HISTORIAS } from "../src/contexts/historias/constantes.js";

function carregarComponente(arquivo, resolver) {
  const modulo = { exports: {} };
  const codigo = transformSync(readFileSync(arquivo, "utf8"), {
    loader: "jsx",
    format: "cjs",
    jsx: "automatic",
  }).code;
  runInNewContext(codigo, {
    module: modulo,
    exports: modulo.exports,
    require: (caminho) =>
      caminho === "react/jsx-runtime" ? jsxRuntime : resolver(caminho),
  });
  return modulo.exports.default;
}

test("ajuda e avanço têm chaves distintas e só existe uma ajuda em cada geração da partida", () => {
  let partida;
  const Historias = carregarComponente(
    "src/pages/historias/jogar/index.jsx",
    (caminho) => {
      if (caminho.includes("contexts/interface"))
        return { useInterface: () => ({ t: (texto) => texto }) };
      if (caminho.includes("hooks/usePartida"))
        return { usePartida: () => partida };
      if (caminho === "./styles")
        return {
          Titulo: "h2",
          Instrucao: "p",
          Conferir: "button",
          Rodape: "footer",
        };
      return {
        __esModule: true,
        default: caminho.includes("AjudaHistoria")
          ? "ajuda"
          : caminho.includes("AvancoRodada")
            ? "avanco"
            : "componente",
      };
    },
  );
  for (let geracao = 0; geracao < 30; geracao++)
    for (const venceu of [false, true]) {
      partida = { geracao, venceu, rodada: { titulo: "História" } };
      const raiz = Historias({});
      const filhos = raiz.props.children.filter(
        (filho) => filho && typeof filho === "object",
      );
      const chaves = filhos
        .filter((filho) => filho.key !== null)
        .map((filho) => filho.key);
      assert.equal(
        new Set(chaves).size,
        chaves.length,
        `chaves duplicadas na geração ${geracao}`,
      );
      assert.equal(filhos.filter((filho) => filho.type === "ajuda").length, 1);
      assert.notEqual(
        filhos.find((filho) => filho.type === "ajuda").key,
        filhos.find((filho) => filho.type === "avanco").key,
      );
    }
});

test("modal tem voltar à esquerda, avanço à direita e ação final, sem botão textual Fechar", () => {
  let indice = 0;
  const fechar = () => {},
    anterior = () => {},
    proxima = () => {};
  const estilos = Object.fromEntries(
    [
      "Abrir",
      "Dialogo",
      "Cabecalho",
      "Fechar",
      "Pagina",
      "Ilustracao",
      "Texto",
      "Rodape",
      "Seta",
      "Contador",
      "Concluir",
    ].map((nome) => [nome, nome]),
  );
  const Ajuda = carregarComponente(
    "src/pages/historias/jogar/components/AjudaHistoria/index.jsx",
    (caminho) => {
      if (caminho.includes("contexts/interface"))
        return { useInterface: () => ({ t: (texto) => texto }) };
      if (caminho.includes("useCinemaHistoria"))
        return {
          useCinemaHistoria: () => ({
            aberto: true,
            indice,
            fechar,
            anterior,
            proxima,
            abrir() {},
          }),
        };
      if (caminho === "./styles") return estilos;
      return { __esModule: true, default: "ilustracao" };
    },
  );
  const rodada = {
    titulo: "História",
    slides: [{ id: "capa", capa: true }, { id: "cena-1" }, { id: "cena-2" }],
  };
  for (indice = 0; indice < rodada.slides.length; indice++) {
    const raiz = Ajuda({ rodada });
    const modal = raiz.props.children.find(
      (filho) => filho?.type === "Dialogo",
    );
    assert.equal(modal.props.onClose, fechar);
    const rodape = modal.props.children.find(
      (filho) => filho?.type === "Rodape",
    );
    const [voltar, contador, avancar] = rodape.props.children;
    assert.equal(voltar.type, "Seta");
    assert.equal(voltar.props.onClick, anterior);
    assert.equal(contador.type, "Contador");
    assert.equal(
      avancar.type,
      indice === rodada.slides.length - 1 ? "Concluir" : "Seta",
    );
    assert.equal(
      avancar.props.onClick,
      indice === rodada.slides.length - 1 ? fechar : proxima,
    );
    if (indice === rodada.slides.length - 1)
      assert.equal(avancar.props.children, "Vamos organizar!");
    assert.ok(
      !rodape.props.children.some(
        (filho) => filho?.props?.children === "Fechar",
      ),
    );
  }
});

test("a ilustração da capa não mostra uma peça e as outras cenas preservam seu símbolo", () => {
  const Ilustracao = carregarComponente(
    "src/pages/historias/jogar/components/IlustracaoHistoria/index.jsx",
    (caminho) => {
      if (caminho === "react") return { useId: () => "teste" };
      throw new Error(caminho);
    },
  );
  const capa = renderToStaticMarkup(
    Ilustracao({
      historiaId: "plantinha",
      slide: { capa: true, figura: "📖", etapaIlustracao: -1 },
    }),
  );
  assert.ok(!capa.includes("<text "));
  assert.ok(!capa.includes("📖"));
  const cena = renderToStaticMarkup(
    Ilustracao({
      historiaId: "plantinha",
      slide: { figura: "💧", etapaIlustracao: 2 },
    }),
  );
  assert.ok(cena.includes("💧"));
});

test("a turma tem a menina e cinco animais, sem os pais, e peças menores em posições variadas e estáveis", () => {
  const Ilustracao = carregarComponente(
    "src/pages/historias/jogar/components/IlustracaoHistoria/index.jsx",
    (caminho) => {
      if (caminho === "react") return { useId: () => "teste" };
      throw new Error(caminho);
    },
  );
  const esperados = [
    "aurora",
    "capivara",
    "raposa",
    "coala",
    "preguica",
    "corujao",
  ].sort();
  const render = (historiaId, slide) =>
    renderToStaticMarkup(Ilustracao({ historiaId, slide }));
  const verificarTurma = (html) =>
    assert.deepEqual(
      [...html.matchAll(/data-personagem="([^"]+)"/g)]
        .map((achou) => achou[1])
        .sort(),
      esperados,
    );
  for (const historia of HISTORIAS) {
    const capa = render(historia.id, { capa: true, etapaIlustracao: -1 });
    verificarTurma(capa);
    assert.ok(!capa.includes("data-peca-cena"));
    const posicoes = new Set();
    for (const [etapaIlustracao, [figura]] of historia.cenas.entries()) {
      const slide = { figura, etapaIlustracao };
      const html = render(historia.id, slide);
      verificarTurma(html);
      assert.equal(
        html,
        render(historia.id, slide),
        "rerender não deve mudar a posição",
      );
      const peca = html.match(
        /data-peca-cena="true" transform="translate\((\d+) (\d+)\)"/,
      );
      assert.ok(peca);
      posicoes.add(`${peca[1]}-${peca[2]}`);
      const x = Number(peca[1]),
        y = Number(peca[2]);
      assert.ok(x - 44 >= 0 && x + 44 <= 600 && y - 44 >= 0 && y + 44 <= 320);
      assert.ok(x < 210 || x > 400, "o centro da cena deve permanecer livre");
      assert.ok(html.includes('<circle r="42"'));
      assert.ok(html.includes('font-size="54"'));
      assert.ok(html.includes(figura));
    }
    assert.ok(posicoes.size > 1, historia.id);
  }
});
