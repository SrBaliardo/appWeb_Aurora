import test from "node:test";
import assert from "node:assert/strict";
import en from "../src/contexts/interface/mensagens/en-US.js";
import es from "../src/contexts/interface/mensagens/es-ES.js";
import { construirTradutor } from "../src/contexts/interface/builders/mensagem.js";
import { idiomaInterfaceValido } from "../src/contexts/interface/regras.js";
import { PALAVRAS } from "../src/contexts/palavras/constantes.js";
import { PISTAS_INICIAIS } from "../src/contexts/palavras/pistasIniciais.js";
import { FIGURAS } from "../src/contexts/descobertas/constantes.js";
import { construirBanco } from "../src/contexts/descobertas/builders/rodada.js";
import { dicasDaConta } from "../src/contexts/matematica/regras.js";
import { construirPalavra } from "../src/contexts/palavras/builders/rodada.js";

test("catálogos têm as mesmas chaves e preservam todos os parâmetros das mensagens", () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
  for (const mensagens of [en, es]) {
    for (const [origem, destino] of Object.entries(mensagens)) {
      assert.ok(destino.trim(), origem);
      assert.deepEqual(
        [...origem.matchAll(/\{\w+\}/g)].map((item) => item[0]).sort(),
        [...destino.matchAll(/\{\w+\}/g)].map((item) => item[0]).sort(),
        origem,
      );
    }
  }
});

for (const [idioma, mensagens] of [
  ["en-US", en],
  ["es-ES", es],
]) {
  test(`interface ${idioma}: todas as pistas iniciais e dicas de palavras/figuras têm tradução`, () => {
    const fontes = [
      ...PALAVRAS.flatMap((item) => item.dicas),
      ...Object.values(PISTAS_INICIAIS),
      ...FIGURAS.flatMap((item) => item.dicas),
    ];
    for (const texto of fontes)
      assert.ok(Object.hasOwn(mensagens, texto), texto);
  });

  test(`interface ${idioma}: pistas numéricas, aritméticas e adaptações de grafia são traduzidas`, () => {
    const t = construirTradutor(mensagens);
    const conferir = (dica) => {
      // Algumas frases são idênticas em português e espanhol, como “Visita flores.”.
      if (Object.hasOwn(mensagens, dica))
        assert.equal(t(dica), mensagens[dica]);
      else assert.notEqual(t(dica), dica, dica);
    };
    for (const idiomaPalavra of ["pt-BR", "en-US", "es-ES"]) {
      for (const nivel of ["facil", "dificil"]) {
        for (const item of construirBanco(nivel, idiomaPalavra)) {
          for (const dica of item.dicas) conferir(dica);
        }
        for (let i = 0; i < 80; i += 1) {
          const rodada = construirPalavra(
            undefined,
            () => (i + 0.5) / 80,
            nivel,
            idiomaPalavra,
          );
          for (const dica of rodada.dicas) conferir(dica);
        }
        for (const operacao of ["+", "−", "×", "÷"]) {
          for (const dica of dicasDaConta(14, 2, operacao, nivel))
            conferir(dica);
        }
      }
    }
  });
}

test("traduz mensagens dinâmicas sem mudar as respostas nem a marca", () => {
  const t = construirTradutor(en);
  assert.equal(t("Aventuras da Aurora"), "Aventuras da Aurora");
  assert.equal(t("Isso! É abelha!"), "That’s right! It’s abelha!");
  assert.equal(
    t("Muito bem! Você escreveu ABEJA!"),
    "Well done! You spelled ABEJA!",
  );
  assert.equal(t("Próxima letra: 2 de 5"), "Next letter: 2 of 5");
  assert.equal(t("4 tentativas restantes"), "4 tries left");
  assert.equal(t("1 tentativa restante"), "1 try left");
  assert.equal(
    t("Jogar {nome}", { nome: t("Forca do bosque") }),
    "Play Woodland hangman",
  );
  assert.equal(
    t("A palavra era ONE HUNDRED. Vamos tentar outra?"),
    "The word was ONE HUNDRED. Shall we try another?",
  );
  assert.equal(
    t("A palavra era a.b+?. Vamos tentar outra?"),
    "The word was a.b+?. Shall we try another?",
  );
  assert.equal(
    t("A palavra era a.b+?. Vamos tentar outra!"),
    "A palavra era a.b+?. Vamos tentar outra!",
  );
});

test("português é a base e somente os três idiomas autorizados são aceitos", () => {
  const t = construirTradutor();
  assert.equal(t("Escolha uma letra"), "Escolha uma letra");
  assert.equal(t("Jogar {nome}", { nome: "Forca" }), "Jogar Forca");
  assert.ok(
    idiomaInterfaceValido("pt-BR") &&
      idiomaInterfaceValido("en-US") &&
      idiomaInterfaceValido("es-ES"),
  );
  assert.equal(idiomaInterfaceValido("fr-FR"), false);
});
