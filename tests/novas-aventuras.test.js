import test from "node:test";
import assert from "node:assert/strict";
import { construirRodada as sequencias } from "../src/contexts/sequencias/builders/rodada.js";
import { avaliarSequencia } from "../src/contexts/sequencias/regras.js";
import { construirRodada as contagem } from "../src/contexts/contagem/builders/rodada.js";
import { avaliarContagem } from "../src/contexts/contagem/regras.js";
import { construirRodada as iniciais } from "../src/contexts/iniciais/builders/rodada.js";
import { PALAVRAS } from "../src/contexts/iniciais/constantes.js";
import { avaliarInicial } from "../src/contexts/iniciais/regras.js";
import { construirRodada as classificacao } from "../src/contexts/classificacao/builders/rodada.js";
import {
  avaliarDestino,
  concluiuClassificacao,
} from "../src/contexts/classificacao/regras.js";
import { construirRodada as historias } from "../src/contexts/historias/builders/rodada.js";
import {
  posicionarCena,
  historiaCompleta,
  avaliarHistoria,
} from "../src/contexts/historias/regras.js";
import { HISTORIAS } from "../src/contexts/historias/constantes.js";
import { useHistorias } from "../src/contexts/historias/index.js";
import { construirTradutor } from "../src/contexts/interface/builders/mensagem.js";
import en from "../src/contexts/interface/mensagens/en-US.js";
import es from "../src/contexts/interface/mensagens/es-ES.js";

function gerador(semente = 852) {
  return () => {
    semente = (semente * 16807) % 2147483647;
    return (semente - 1) / 2147483646;
  };
}

test("banco ampliado tem dez histórias distintas com narrativas em todas as cenas", () => {
  assert.equal(HISTORIAS.length, 10);
  assert.equal(new Set(HISTORIAS.map((historia) => historia.id)).size, 10);
  for (const historia of HISTORIAS) {
    assert.equal(historia.facil.length, 3);
    assert.ok([4, 5].includes(historia.cenas.length));
    assert.ok(
      historia.cenas.every(
        ([figura, texto, narracao]) => figura && texto && narracao,
      ),
    );
  }
});

for (const nivel of ["facil", "dificil"]) {
  test(`${nivel}: sequências têm padrão coerente, quatro opções e uma resposta correta`, () => {
    const random = gerador();
    let anterior;
    for (let i = 0; i < 150; i++) {
      const rodada = sequencias(anterior, random, nivel);
      assert.notEqual(rodada.id, anterior);
      anterior = rodada.id;
      assert.equal(new Set(rodada.opcoes.map((opcao) => opcao.id)).size, 4);
      assert.equal(
        rodada.opcoes.filter((opcao) => avaliarSequencia(rodada, opcao.id))
          .length,
        1,
      );
      assert.equal(rodada.dicas.length, nivel === "facil" ? 3 : 1);
      const serie = [
        ...rodada.serie.map((item) => item.figura),
        rodada.figuraFinal.figura,
      ];
      if (rodada.id.startsWith("numeros")) {
        const valores = serie.map((figura) => figura.valor);
        assert.ok(
          valores.every(
            (valor, indice) =>
              indice === 0 ||
              valor - valores[indice - 1] === Number(rodada.id.split("-")[1]),
          ),
        );
        assert.equal(String(valores.at(-1)), rodada.resposta);
      } else {
        const periodo = nivel === "facil" ? 2 : rodada.id === "abbc" ? 4 : 3;
        assert.deepEqual(serie.slice(0, periodo), serie.slice(periodo));
        assert.equal(serie.at(-1), rodada.resposta);
      }
      assert.equal(avaliarSequencia(rodada, "inexistente"), false);
    }
  });
  test(`${nivel}: contagem corresponde exatamente à cena, inclusive com distratores`, () => {
    const random = gerador();
    let anterior;
    for (let i = 0; i < 100; i++) {
      const rodada = contagem(anterior, random, nivel);
      assert.notEqual(rodada.id, anterior);
      anterior = rodada.id;
      const contadas = rodada.cena.filter(
        (figura) => figura.tipo === rodada.alvo.id,
      ).length;
      assert.equal(rodada.resposta, contadas);
      const limite = nivel === "dificil" ? 20 : 10;
      assert.equal(rodada.cena.length, limite);
      assert.ok(contadas >= 1 && contadas <= limite);
      assert.equal(
        new Set(rodada.cena.map((figura) => figura.id)).size,
        rodada.cena.length,
      );
      assert.equal(new Set(rodada.opcoes.map((opcao) => opcao.id)).size, 4);
      assert.equal(
        rodada.opcoes.filter((opcao) => avaliarContagem(rodada, opcao.id))
          .length,
        1,
      );
      assert.equal(
        rodada.cena.filter((figura) => figura.tipo !== rodada.alvo.id).length,
        limite - contadas,
      );
      assert.ok(
        rodada.opcoes.every(
          (opcao) => Number(opcao.id) >= 0 && Number(opcao.id) <= limite,
        ),
      );
    }
    for (const [random, esperado] of [
      [() => 0, 1],
      [() => 0.999999, nivel === "dificil" ? 20 : 10],
    ]) {
      const rodada = contagem(undefined, random, nivel);
      assert.equal(rodada.resposta, esperado);
      assert.equal(
        rodada.cena.filter((item) => item.tipo === rodada.alvo.id).length,
        esperado,
      );
    }
  });
  for (const idioma of ["pt-BR", "en-US", "es-ES"]) {
    test(`${nivel}/${idioma}: iniciais e sílabas recompõem a palavra correta, sem respostas duplicadas`, () => {
      const random = gerador();
      let anterior;
      for (let i = 0; i < 80; i++) {
        const rodada = iniciais(anterior, random, nivel, idioma);
        assert.notEqual(rodada.id, anterior);
        anterior = rodada.id;
        assert.equal(rodada.resposta + rodada.resto, rodada.palavra);
        const item = PALAVRAS.find((palavra) => palavra.id === rodada.id),
          indice = ["pt-BR", "en-US", "es-ES"].indexOf(idioma);
        assert.equal(rodada.palavra, item.nomes[indice]);
        assert.equal(
          rodada.resposta,
          nivel === "dificil"
            ? item.silabas[indice].split("-")[0]
            : Array.from(item.nomes[indice])[0],
        );
        if (nivel === "dificil") assert.ok(item.silabas[indice].includes("-"));
        assert.equal(rodada.opcoes.length, 4);
        assert.equal(new Set(rodada.opcoes.map((opcao) => opcao.id)).size, 4);
        assert.equal(
          rodada.opcoes.filter((opcao) => avaliarInicial(rodada, opcao.id))
            .length,
          1,
        );
        assert.equal(rodada.dicas.length, nivel === "facil" ? 3 : 1);
      }
    });
  }
  test(`${nivel}: classificação aceita somente o grupo correto e não conta duplicatas`, () => {
    const random = gerador();
    for (let i = 0; i < 40; i++) {
      const rodada = classificacao(undefined, random, nivel);
      assert.equal(rodada.itens.length, nivel === "facil" ? 6 : 24);
      assert.equal(rodada.grupos.length, nivel === "facil" ? 3 : 4);
      for (const grupo of rodada.grupos)
        assert.equal(
          rodada.itens.filter((item) => item.grupo === grupo.id).length,
          nivel === "facil" ? 2 : 6,
        );
      assert.equal(
        new Set(rodada.itens.map((item) => item.id)).size,
        rodada.itens.length,
      );
      for (const item of rodada.itens) {
        assert.equal(avaliarDestino(rodada, [], item.id, item.grupo), "acerto");
        const outro = rodada.grupos.find((grupo) => grupo.id !== item.grupo);
        assert.equal(avaliarDestino(rodada, [], item.id, outro.id), "erro");
        assert.equal(
          avaliarDestino(rodada, [item.id], item.id, item.grupo),
          "ignorar",
        );
      }
      assert.equal(
        avaliarDestino(rodada, [], "inexistente", rodada.grupos[0].id),
        "ignorar",
      );
      assert.equal(
        concluiuClassificacao(
          rodada,
          Array(rodada.itens.length).fill(rodada.itens[0].id),
        ),
        false,
      );
      assert.equal(
        concluiuClassificacao(
          rodada,
          rodada.itens.map((item) => item.id),
        ),
        true,
      );
    }
  });
  test(`${nivel}: histórias têm tamanho adequado e só a ordem completa conclui`, () => {
    const random = gerador();
    let anterior;
    for (let i = 0; i < 50; i++) {
      const rodada = historias(anterior, random, nivel);
      assert.notEqual(rodada.id, anterior);
      anterior = rodada.id;
      assert.ok(
        nivel === "facil"
          ? rodada.cenas.length === 3
          : [4, 5].includes(rodada.cenas.length),
      );
      assert.deepEqual(
        rodada.embaralhadas.map((cena) => cena.id).sort(),
        rodada.cenas.map((cena) => cena.id).sort(),
      );
      assert.equal(rodada.slides.length, rodada.cenas.length + 1);
      assert.equal(rodada.slides[0].capa, true);
      assert.equal(rodada.slides[0].texto, rodada.titulo);
      assert.deepEqual(
        rodada.slides.slice(1).map((slide) => slide.id),
        rodada.cenas.map((cena) => cena.id),
      );
      for (const cena of rodada.cenas)
        assert.ok(cena.narracao && Number.isInteger(cena.etapaIlustracao));
      const ordem = rodada.cenas.map((cena) => cena.id);
      assert.equal(historiaCompleta(rodada, ordem), true);
      assert.equal(historiaCompleta(rodada, [...ordem].reverse()), false);
      assert.equal(historiaCompleta(rodada, ordem.slice(1)), false);
      assert.equal(avaliarHistoria(rodada, ordem).every(Boolean), true);
      const original = Object.freeze([...ordem]);
      const movida = posicionarCena(rodada.cenas, original, ordem[0], 1);
      assert.equal(movida[0], ordem[1]);
      assert.equal(movida[1], ordem[0]);
      assert.equal(movida.filter((id) => id === ordem[0]).length, 1);
      assert.equal(original[0], ordem[0]);
      assert.deepEqual([...movida].sort(), [...ordem].sort());
      const apenasUma = posicionarCena(rodada.cenas, [], ordem[0], 0);
      const substituir = posicionarCena(rodada.cenas, apenasUma, ordem[1], 0);
      assert.equal(substituir[0], ordem[1]);
      assert.equal(substituir.includes(ordem[0]), false);
      for (const invalido of [-1, NaN, 0.5, rodada.cenas.length])
        assert.equal(
          posicionarCena(rodada.cenas, ordem, ordem[0], invalido),
          null,
        );
      assert.equal(posicionarCena(rodada.cenas, ordem, "inexistente", 0), null);
    }
  });
}

test("as divisões de escrita reconstituem as palavras em cada idioma", () => {
  for (const palavra of PALAVRAS)
    for (let indice = 0; indice < 3; indice++)
      assert.equal(
        palavra.silabas[indice].replaceAll("-", ""),
        palavra.nomes[indice],
      );
});

test("fachada de histórias normaliza destinos do arraste e rejeita destinos vazios ou inválidos", () => {
  const jogo = useHistorias(),
    rodada = jogo.novaRodada(undefined, () => 0, "facil"),
    id = rodada.cenas[0].id;
  assert.equal(jogo.posicionar(rodada.cenas, [], id, "0")[0], id);
  for (const invalido of [null, undefined, "", "abc", "-1"])
    assert.equal(jogo.posicionar(rodada.cenas, [], id, invalido), null);
  assert.equal(jogo.preenchida(rodada, []), false);
  assert.equal(
    jogo.preenchida(rodada, rodada.cenas.map((cena) => cena.id).reverse()),
    true,
  );
  assert.equal(
    jogo.concluiu(rodada, rodada.cenas.map((cena) => cena.id).reverse()),
    false,
  );
});

test("novas pistas, confirmações, cenas e grupos têm tradução nos dois catálogos", () => {
  for (const mensagens of [en, es]) {
    const t = construirTradutor(mensagens);
    for (const nivel of ["facil", "dificil"]) {
      const random = gerador();
      for (let i = 0; i < 70; i++) {
        for (const construir of [sequencias, contagem, iniciais]) {
          const rodada = construir(undefined, random, nivel);
          for (const texto of [
            rodada.pergunta,
            rodada.confirmacao,
            ...rodada.dicas,
          ])
            assert.notEqual(t(texto), texto, texto);
        }
        const rodada = classificacao(undefined, random, nivel);
        for (const grupo of rodada.grupos)
          assert.ok(Object.hasOwn(mensagens, grupo.nome), grupo.nome);
        for (const item of rodada.itens)
          assert.ok(Object.hasOwn(mensagens, item.nome), item.nome);
      }
    }
    for (const historia of HISTORIAS) {
      assert.ok(Object.hasOwn(mensagens, historia.titulo));
      for (const [, texto, narracao] of historia.cenas) {
        assert.ok(Object.hasOwn(mensagens, texto), texto);
        assert.ok(Object.hasOwn(mensagens, narracao), narracao);
      }
    }
  }
});
