import test from "node:test";
import assert from "node:assert/strict";
import { PALAVRAS } from "../src/contexts/palavras/constantes.js";
import { TRADUCOES } from "../src/contexts/palavras/traducoes.js";
import {
  construirPalavra,
  construirLacunas,
} from "../src/contexts/palavras/builders/rodada.js";
import { obterDicas, avaliarLacunas } from "../src/contexts/palavras/regras.js";
import {
  consultarAlfabeto,
  normalizarEntrada,
  consultarNome,
} from "../src/contexts/palavras/index.js";
import { avaliarForca } from "../src/contexts/forca/regras.js";
import {
  construirBanco,
  construirRodada as descoberta,
} from "../src/contexts/descobertas/builders/rodada.js";
import {
  FIGURAS_TRADUZIDAS,
  NUMEROS_TRADUZIDOS,
  DEZENAS_TRADUZIDAS,
} from "../src/contexts/descobertas/traducoes.js";
import { construirRodada as escrita } from "../src/contexts/escrita/builders/rodada.js";
import {
  avaliarEscrita,
  podeAdicionarLetra,
} from "../src/contexts/escrita/regras.js";
import { construirRodada as cores } from "../src/contexts/cores/builders/rodada.js";
import { construirRodada as matematica } from "../src/contexts/matematica/builders/rodada.js";
import { TEMAS } from "../src/contexts/memoria/constantes.js";
import { construirTabuleiro } from "../src/contexts/memoria/builders/tabuleiro.js";

function gerador(semente = 345) {
  return () => {
    semente = (semente * 16807) % 2147483647;
    return (semente - 1) / 2147483646;
  };
}

test("vocabulário tem tradução completa e os exemplos abelha e cinco correspondem aos idiomas", () => {
  for (const palavra of PALAVRAS) {
    assert.equal(TRADUCOES[palavra.id]?.length, 2, palavra.id);
    assert.ok(
      TRADUCOES[palavra.id].every(
        (texto) => typeof texto === "string" && texto.length > 0,
      ),
      palavra.id,
    );
  }
  assert.equal(consultarNome("abelha", "ABELHA", "en-US"), "BEE");
  assert.equal(consultarNome("abelha", "ABELHA", "es-ES"), "ABEJA");
  for (const [idioma, cinco] of [
    ["pt-BR", "CINCO"],
    ["en-US", "FIVE"],
    ["es-ES", "CINCO"],
  ]) {
    assert.equal(
      construirBanco("facil", idioma).find((item) => item.id === "numero-5")
        .texto,
      cinco,
    );
  }
});

test("espanhol preserva Ñ e aceita acentos equivalentes sem confundir N e Ñ", () => {
  assert.equal(normalizarEntrada("niño", "es-ES"), "NIÑO");
  assert.equal(normalizarEntrada("nin\u0303o", "es-ES"), "NIÑO");
  assert.equal(normalizarEntrada("árbol", "es-ES"), "ARBOL");
  assert.ok(consultarAlfabeto("es-ES").includes("Ñ"));
  assert.ok(!consultarAlfabeto("en-US").includes("Ñ"));
  assert.equal(
    podeAdicionarLetra({ letras: [..."NIÑO"] }, [..."NI"], "N"),
    false,
  );
  assert.equal(
    podeAdicionarLetra({ letras: [..."NIÑO"] }, [..."NI"], "Ñ"),
    true,
  );
});

for (const idioma of ["pt-BR", "en-US", "es-ES"]) {
  for (const nivel of ["facil", "dificil"]) {
    test(`forca e palavrinhas ${idioma}/${nivel}: grafia, dicas extras, separadores e conclusão`, () => {
      const random = gerador();
      let anterior;
      for (let i = 0; i < 250; i += 1) {
        const rodada = construirPalavra(anterior, random, nivel, idioma);
        assert.notEqual(rodada.id, anterior);
        assert.equal(
          rodada.texto,
          consultarNome(
            rodada.id,
            PALAVRAS.find((item) => item.id === rodada.id).texto,
            idioma,
          ),
        );
        assert.equal(rodada.idioma, idioma);
        const letras = rodada.letras.filter((letra) =>
          consultarAlfabeto(idioma).includes(letra),
        );
        assert.ok(letras.length > 0);
        assert.equal(avaliarForca(rodada, [...new Set(letras)]).venceu, true);
        rodada.letras.forEach((letra, indice) => {
          if (!consultarAlfabeto(idioma).includes(letra))
            assert.equal(avaliarForca(rodada, []).posicoes[indice], true);
        });
        assert.ok(rodada.pistaInicial);
        assert.equal(
          obterDicas(rodada, 99, nivel).length,
          nivel === "facil" ? 3 : 1,
        );
        const lacunas = construirLacunas(undefined, random, nivel, idioma);
        assert.ok(
          lacunas.ocultas.every((letra) =>
            consultarAlfabeto(idioma).includes(letra),
          ),
        );
        assert.ok(avaliarLacunas(lacunas, []).posicoes.some(Boolean));
        assert.ok(avaliarLacunas(lacunas, []).posicoes.includes(false));
        assert.equal(avaliarLacunas(lacunas, lacunas.ocultas).venceu, true);
        anterior = rodada.id;
      }
    });

    test(`descobertas e escrita ${idioma}/${nivel}: banco completo, quatro opções e grafia posição a posição`, () => {
      const random = gerador();
      const banco = construirBanco(nivel, idioma);
      const original = construirBanco(nivel);
      assert.deepEqual(
        banco.map((item) => item.id),
        original.map((item) => item.id),
      );
      for (const item of banco) {
        assert.ok(item.texto);
        const fonte = original.find((alvo) => alvo.id === item.id);
        assert.deepEqual(item.dicas.slice(0, 2), fonte.dicas.slice(0, 2));
        if (idioma !== "pt-BR") {
          const indice = idioma === "en-US" ? 0 : 1;
          const esperado =
            item.tipo === "numero"
              ? NUMEROS_TRADUZIDOS[idioma][item.figura.valor] ||
                DEZENAS_TRADUZIDAS[idioma][item.figura.valor]
              : FIGURAS_TRADUZIDAS[item.id]?.[indice] ||
                TRADUCOES[item.id]?.[indice];
          assert.ok(esperado, `Tradução ausente: ${item.id}`);
          assert.equal(item.texto, esperado, item.id);
        }
      }
      for (let i = 0; i < 200; i += 1) {
        const rodada = descoberta(undefined, random, nivel, idioma);
        assert.equal(new Set(rodada.opcoes.map((item) => item.texto)).size, 4);
        assert.ok(
          rodada.opcoes.every(
            (item) =>
              item.texto === banco.find((alvo) => alvo.id === item.id).texto,
          ),
        );
        assert.equal(
          rodada.opcoes.filter((item) => item.id === rodada.resposta).length,
          1,
        );
        assert.match(rodada.pergunta, /Que|O que/);
        const alvo = escrita(undefined, random, nivel, idioma);
        const digitadas = [];
        for (const letra of alvo.letras) {
          assert.ok(consultarAlfabeto(idioma).includes(letra));
          assert.equal(podeAdicionarLetra(alvo, digitadas, letra), true);
          digitadas.push(letra);
        }
        assert.equal(avaliarEscrita(alvo, digitadas).venceu, true);
        assert.equal(
          avaliarEscrita(alvo, digitadas).posicoes.length,
          [...alvo.textoExibicao].length,
        );
      }
    });

    test(`cores ${idioma}/${nivel}: alternativas traduzidas preservam ids e cores`, () => {
      const random = gerador();
      const original = gerador();
      for (let i = 0; i < 120; i += 1) {
        const rodada = cores(undefined, random, nivel, idioma);
        const portugues = cores(undefined, original, nivel);
        assert.equal(rodada.cor.id, portugues.cor.id);
        assert.equal(rodada.cor.hex, portugues.cor.hex);
        assert.deepEqual(
          rodada.opcoes.map((item) => item.id),
          portugues.opcoes.map((item) => item.id),
        );
        assert.equal(new Set(rodada.opcoes.map((item) => item.nome)).size, 4);
        assert.ok(rodada.opcoes.every((item) => item.nome));
      }
    });
  }

  test(`memória ${idioma}: legendas preservam figuras e oito pares nos quatro temas`, () => {
    for (const tema of TEMAS) {
      const cartas = construirTabuleiro(tema.id, gerador(), idioma);
      const originais = construirTabuleiro(tema.id, gerador());
      assert.equal(new Set(cartas.map((item) => item.par)).size, 8);
      cartas.forEach((carta, indice) => {
        assert.equal(carta.id, originais[indice].id);
        assert.deepEqual(carta.figura, originais[indice].figura);
        assert.ok(carta.nome);
      });
    }
  });

  test(`continhas ${idioma}: operações e respostas numéricas permanecem iguais`, () => {
    assert.deepEqual(
      matematica(undefined, gerador(), "dificil", idioma),
      matematica(undefined, gerador(), "dificil"),
    );
  });
}
