import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  construirPalavra,
  construirLacunas,
} from "../src/contexts/palavras/builders/rodada.js";
import { obterDicas, avaliarLacunas } from "../src/contexts/palavras/regras.js";
import { VOCABULARIO_LIVROS } from "../src/contexts/palavras/vocabularioLivros.js";
import { construirRodada as matematica } from "../src/contexts/matematica/builders/rodada.js";
import {
  avaliarResultado,
  calcular,
} from "../src/contexts/matematica/regras.js";
import {
  construirBanco,
  construirRodada as descoberta,
} from "../src/contexts/descobertas/builders/rodada.js";
import { construirRodada as escrita } from "../src/contexts/escrita/builders/rodada.js";
import {
  avaliarEscrita,
  podeAdicionarLetra,
} from "../src/contexts/escrita/regras.js";
import { construirTabuleiro } from "../src/contexts/memoria/builders/tabuleiro.js";
import { configuracaoNivel } from "../src/contexts/memoria/regras.js";
import { useMemoria } from "../src/contexts/memoria/index.js";
import { construirRodada as cores } from "../src/contexts/cores/builders/rodada.js";

function gerador(semente = 729) {
  return () => {
    semente = (semente * 16807) % 2147483647;
    return (semente - 1) / 2147483646;
  };
}

test("nomes dos personagens e elementos dos livros têm três pistas revisadas", () => {
  const ids = new Set(VOCABULARIO_LIVROS.map((item) => item.id));
  for (const id of [
    "aurora",
    "pai",
    "mae",
    "coala",
    "corujao",
    "preguica",
    "bala",
    "suco",
    "bosque",
    "mochila",
    "piquenique",
  ])
    assert.ok(ids.has(id));
  for (const item of VOCABULARIO_LIVROS)
    assert.equal(new Set(item.dicas).size, 3, item.id);
});

test("memória começa na turma da Aurora com pai e mãe em oito pares", () => {
  assert.equal(useMemoria().temaPadrao, "aurora");
  const cartas = construirTabuleiro("aurora", gerador());
  const ids = new Set(cartas.map((item) => item.par));
  assert.equal(cartas.length, 16);
  assert.equal(ids.size, 8);
  assert.ok(ids.has("pai") && ids.has("mae"));
  assert.ok(!ids.has("sapo") && !ids.has("libelula"));
  for (const carta of cartas) {
    assert.equal(carta.figura.tipo, "retrato");
    assert.ok(existsSync(`public${carta.figura.src}`));
    assert.equal(cartas.filter((item) => item.par === carta.par).length, 2);
  }
  assert.ok(
    configuracaoNivel("dificil").tempoPrevia <
      configuracaoNivel("facil").tempoPrevia,
  );
  assert.equal(configuracaoNivel("dificil").mostrarNomes, false);
});

for (const nivel of ["facil", "dificil"]) {
  const dicas = nivel === "facil" ? 3 : 1;
  test(`palavras ${nivel}: vocabulário, pistas e lacunas coerentes`, () => {
    const random = gerador();
    for (let i = 0; i < 300; i += 1) {
      const palavra = construirPalavra(undefined, random, nivel);
      assert.ok(
        nivel === "facil"
          ? palavra.texto.length <= 8
          : palavra.texto.length >= 7,
      );
      assert.equal(obterDicas(palavra, 99, nivel).length, dicas);
      const rodada = construirLacunas(undefined, random, nivel);
      assert.ok(avaliarLacunas(rodada, []).posicoes.some(Boolean));
      assert.equal(avaliarLacunas(rodada, rodada.ocultas).venceu, true);
    }
  });

  test(`matemática ${nivel}: contas válidas, resultados pequenos e quatro respostas únicas`, () => {
    const random = gerador();
    const operacoes = new Set();
    let anterior;
    for (let i = 0; i < 1200; i += 1) {
      const rodada = matematica(anterior, random, nivel);
      assert.notEqual(rodada.id, anterior);
      assert.equal(rodada.opcoes.length, 4);
      assert.equal(new Set(rodada.opcoes.map((opcao) => opcao.id)).size, 4);
      assert.equal(
        rodada.opcoes.filter((opcao) => avaliarResultado(rodada, opcao.id))
          .length,
        1,
      );
      assert.equal(
        rodada.resultado,
        calcular(rodada.a, rodada.b, rodada.operacao),
      );
      assert.ok(Number.isInteger(rodada.resultado));
      assert.ok(
        rodada.resultado >= 0 &&
          rodada.resultado <= (nivel === "facil" ? 9 : 199),
      );
      assert.equal(rodada.dicas.length, dicas);
      if (nivel === "facil") assert.ok(rodada.a <= 9 && rodada.b <= 9);
      if (rodada.operacao === "÷") assert.ok(rodada.b > 0);
      assert.equal(avaliarResultado(rodada, ""), false);
      assert.equal(avaliarResultado(rodada, null), false);
      anterior = rodada.id;
      operacoes.add(rodada.operacao);
    }
    assert.equal(operacoes.size, nivel === "facil" ? 2 : 4);
  });

  test(`descobertas ${nivel}: figuras, formas e números com alternativas da mesma categoria`, () => {
    const random = gerador();
    const banco = construirBanco(nivel);
    const tipos = new Set();
    let anterior;
    for (let i = 0; i < 400; i += 1) {
      const rodada = descoberta(anterior, random, nivel);
      assert.notEqual(rodada.id, anterior);
      assert.equal(rodada.opcoes.length, 4);
      assert.equal(new Set(rodada.opcoes.map((item) => item.texto)).size, 4);
      assert.equal(
        rodada.opcoes.filter((item) => item.id === rodada.resposta).length,
        1,
      );
      assert.ok(
        rodada.opcoes.every(
          (item) =>
            banco.find((alvo) => alvo.id === item.id).tipo === rodada.tipo,
        ),
      );
      assert.equal(rodada.dicas.length, dicas);
      anterior = rodada.id;
      tipos.add(rodada.tipo);
    }
    assert.deepEqual([...tipos].sort(), ["forma", "numero", "objeto"]);
  });

  test(`escrita ${nivel}: todos os alvos podem ser escritos e preservam a grafia`, () => {
    const random = gerador();
    const tipos = new Set();
    for (let i = 0; i < 400; i += 1) {
      const rodada = escrita(undefined, random, nivel);
      const digitadas = [];
      for (const letra of rodada.letras) {
        assert.equal(podeAdicionarLetra(rodada, digitadas, letra), true);
        digitadas.push(letra);
      }
      assert.equal(avaliarEscrita(rodada, digitadas).venceu, true);
      assert.equal(
        avaliarEscrita(rodada, digitadas).posicoes.length,
        rodada.textoExibicao.length,
      );
      assert.equal(podeAdicionarLetra(rodada, digitadas, undefined), false);
      assert.equal(rodada.dicas.length, dicas);
      tipos.add(rodada.tipo);
    }
    assert.deepEqual([...tipos].sort(), ["numero", "objeto"]);
  });
}

test("escrita de ABELHA ocupa somente um espaço por acerto, com A repetido no final", () => {
  const rodada = { letras: [..."ABELHA"] };
  assert.deepEqual(avaliarEscrita(rodada, ["A"]).posicoes, [
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  assert.equal(podeAdicionarLetra(rodada, ["A"], "A"), false);
  assert.equal(podeAdicionarLetra(rodada, [..."ABELH"], "A"), true);
  assert.equal(avaliarEscrita(rodada, [..."ABELHA"]).venceu, true);
});

test("número 5 corresponde à escrita CINCO; nível difícil inclui dezenas", () => {
  const cinco = construirBanco().find((item) => item.id === "numero-5");
  assert.equal(cinco.texto, "CINCO");
  assert.equal(cinco.figura.valor, 5);
  assert.ok(
    construirBanco("dificil").some(
      (item) => item.figura.valor === 50 && item.texto === "CINQUENTA",
    ),
  );
});

test("cores difíceis usam tonalidades diferentes das básicas", () => {
  const random = gerador();
  for (let i = 0; i < 50; i += 1) {
    const rodada = cores(undefined, random, "dificil");
    assert.ok(
      !["verde", "azul", "rosa", "amarelo", "vermelho"].includes(rodada.cor.id),
    );
    assert.equal(new Set(rodada.opcoes.map((item) => item.id)).size, 4);
  }
});
