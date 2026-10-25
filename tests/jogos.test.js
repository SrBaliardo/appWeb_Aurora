import test from "node:test";
import assert from "node:assert/strict";
import {
  construirLacunas,
  construirPalavra,
  normalizarLetras,
} from "../src/contexts/palavras/builders/rodada.js";
import { PALAVRAS } from "../src/contexts/palavras/constantes.js";
import {
  avaliarLacunas,
  obterDicas,
  selecionarVocabulario,
} from "../src/contexts/palavras/regras.js";
import { avaliarForca } from "../src/contexts/forca/regras.js";
import { construirTabuleiro } from "../src/contexts/memoria/builders/tabuleiro.js";
import {
  avaliarPar,
  concluiuMemoria,
  podeVirar,
} from "../src/contexts/memoria/regras.js";
import { construirRodada } from "../src/contexts/cores/builders/rodada.js";
import { avaliarCor } from "../src/contexts/cores/regras.js";

function gerador(semente = 123) {
  return () => {
    semente = (semente * 16807) % 2147483647;
    return (semente - 1) / 2147483646;
  };
}

test("banco de alfabetização tem entradas únicas, dicas e letras válidas", () => {
  assert.equal(new Set(PALAVRAS.map((item) => item.id)).size, PALAVRAS.length);
  for (const palavra of PALAVRAS) {
    assert.match(normalizarLetras(palavra.texto), /^[A-Z]+$/);
    assert.equal(palavra.dicas.length, 3);
    assert.ok(
      palavra.dicas.every(
        (dica) => typeof dica === "string" && dica.trim().length > 0,
      ),
    );
    assert.equal(new Set(palavra.dicas).size, 3);
    assert.equal(obterDicas(palavra, 2).length, 2);
  }
});

test("todas as palavras recebem uma pista inicial extra sem consumir dicas da lâmpada", () => {
  const cobertas = new Set();
  for (const nivel of ["facil", "dificil"]) {
    const banco = selecionarVocabulario(PALAVRAS, nivel);
    banco.forEach((palavra, indice) => {
      const random = () => (indice + 0.5) / banco.length;
      for (const construir of [construirPalavra, construirLacunas]) {
        const rodada = construir(undefined, random, nivel);
        assert.equal(rodada.id, palavra.id);
        assert.equal(typeof rodada.pistaInicial, "string", palavra.id);
        assert.ok(rodada.pistaInicial.trim().length > 0, palavra.id);
        assert.ok(!rodada.dicas.includes(rodada.pistaInicial), palavra.id);
        assert.deepEqual(obterDicas(rodada, 0, nivel), []);
        assert.deepEqual(
          obterDicas(rodada, 99, nivel),
          nivel === "facil" ? palavra.dicas : [palavra.dicas[0]],
        );
        cobertas.add(rodada.id);
      }
    });
  }
  assert.equal(cobertas.size, PALAVRAS.length);
});

test("sorteio evita repetição imediata e preserva acentos na exibição", () => {
  const random = gerador();
  let anterior;
  for (let i = 0; i < 150; i += 1) {
    const rodada = construirPalavra(anterior, random);
    assert.notEqual(rodada.id, anterior);
    assert.equal(rodada.letras.length, [...rodada.texto].length);
    anterior = rodada.id;
  }
  assert.equal(normalizarLetras("maçã"), "MACA");
  assert.equal(normalizarLetras("leão"), "LEAO");
});

test("forca revela todas as ocorrências e não conta letra repetida duas vezes", () => {
  const rodada = { letras: [..."BANANA"] };
  const resultado = avaliarForca(rodada, ["A", "X", "X"]);
  assert.deepEqual(resultado.posicoes, [false, true, false, true, false, true]);
  assert.equal(resultado.erros, 1);
  assert.equal(resultado.restantes, 5);
  assert.equal(resultado.encerrou, false);
  assert.equal(avaliarForca(rodada, ["B", "A", "N"]).venceu, true);
});

test("forca encerra no sexto erro e não antes", () => {
  const rodada = { letras: [..."SOL"] };
  assert.equal(avaliarForca(rodada, [..."ABCDF"]).encerrou, false);
  const resultado = avaliarForca(rodada, [..."ABCDFG"]);
  assert.equal(resultado.encerrou, true);
  assert.equal(resultado.venceu, false);
  assert.equal(resultado.restantes, 0);
});

test("ABELHA com A e L ocultos vira _BE_H_ e revela todos os A juntos", () => {
  const rodada = { letras: [..."ABELHA"], ocultas: ["A", "L"] };
  const inicial = avaliarLacunas(rodada, []);
  assert.equal(
    rodada.letras.map((l, i) => (inicial.posicoes[i] ? l : "_")).join(""),
    "_BE_H_",
  );
  assert.deepEqual(avaliarLacunas(rodada, ["A"]).posicoes, [
    true,
    true,
    true,
    false,
    true,
    true,
  ]);
  assert.equal(avaliarLacunas(rodada, ["Z"]).venceu, false);
  assert.equal(avaliarLacunas(rodada, ["A", "L"]).venceu, true);
  assert.deepEqual(inicial.bloqueadas, ["B", "E", "H"]);
});

test("lacunas sempre deixam letras visíveis e permitem concluir a rodada", () => {
  const random = gerador();
  for (let i = 0; i < 200; i += 1) {
    const rodada = construirLacunas(undefined, random);
    const inicial = avaliarLacunas(rodada, []);
    assert.ok(inicial.posicoes.includes(false));
    assert.ok(inicial.posicoes.includes(true));
    assert.equal(avaliarLacunas(rodada, rodada.ocultas).venceu, true);
  }
});

for (const tema of ["floresta", "mar", "brinquedos"]) {
  test(`memória ${tema}: dezesseis cartas, oito pares e embaralhamento`, () => {
    const cartas = construirTabuleiro(tema, gerador());
    assert.equal(cartas.length, 16);
    assert.equal(new Set(cartas.map((c) => c.id)).size, 16);
    const pares = new Map();
    for (const carta of cartas)
      pares.set(carta.par, (pares.get(carta.par) || 0) + 1);
    assert.equal(pares.size, 8);
    assert.ok([...pares.values()].every((total) => total === 2));
    assert.notDeepEqual(
      cartas.map((c) => c.id),
      construirTabuleiro(tema, gerador(777)).map((c) => c.id),
    );
  });
}

test("memória bloqueia terceira carta, carta repetida, encontrada e prévia", () => {
  assert.equal(podeVirar("c", ["a", "b"], [], false), false);
  assert.equal(podeVirar("a", ["a"], [], false), false);
  assert.equal(podeVirar("a", [], ["a"], false), false);
  assert.equal(podeVirar("a", [], [], true), false);
  assert.equal(podeVirar("b", ["a"], [], false), true);
  assert.equal(
    avaliarPar([
      { id: "a", par: "urso" },
      { id: "b", par: "urso" },
    ]),
    true,
  );
  assert.equal(
    avaliarPar([
      { id: "a", par: "urso" },
      { id: "a", par: "urso" },
    ]),
    false,
  );
  assert.equal(
    avaliarPar([
      { id: "a", par: "urso" },
      { id: "b", par: "gato" },
    ]),
    false,
  );
  assert.equal(concluiuMemoria(Array.from({ length: 16 }, (_, i) => i)), true);
  assert.equal(concluiuMemoria(Array(16).fill("a")), false);
});

test("cores: quatro alternativas únicas, uma correta e sem repetição imediata", () => {
  const random = gerador();
  let anterior;
  const formas = new Set();
  const cores = new Set();
  for (let i = 0; i < 200; i += 1) {
    const rodada = construirRodada(anterior, random);
    assert.equal(rodada.opcoes.length, 4);
    assert.equal(new Set(rodada.opcoes.map((c) => c.id)).size, 4);
    assert.equal(
      rodada.opcoes.filter((c) => avaliarCor(rodada, c.id)).length,
      1,
    );
    assert.notEqual(rodada.cor.id, anterior);
    formas.add(rodada.forma);
    cores.add(rodada.cor.id);
    anterior = rodada.cor.id;
  }
  assert.equal(formas.size, 5);
  assert.equal(cores.size, 10);
});
