import test from "node:test";
import assert from "node:assert/strict";
import { selecionarVoz } from "../src/utils/selecionarVoz.js";
import { criarLeitorNavegador } from "../src/services/descobertas/index.js";

const vozes = [
  { name: "Microsoft Daniel", lang: "pt-BR", default: true },
  { name: "Microsoft Francisca Online (Natural)", lang: "pt-BR" },
  { name: "Microsoft Jenny", lang: "en-US" },
  { name: "Microsoft Elvira", lang: "es-ES" },
];

function navegador(lista = vozes) {
  const falas = [],
    estados = [],
    ouvintes = new Map();
  let cancelamentos = 0;
  const sintese = {
    paused: false,
    getVoices: () => lista,
    speak: (frase) => falas.push(frase),
    cancel: () => {
      cancelamentos += 1;
    },
    addEventListener: (evento, callback) => ouvintes.set(evento, callback),
    removeEventListener: (evento, callback) => {
      if (ouvintes.get(evento) === callback) ouvintes.delete(evento);
    },
    resume: () => {
      sintese.paused = false;
    },
  };
  class Frase {
    constructor(texto) {
      this.text = texto;
    }
  }
  const leitor = criarLeitorNavegador({
    ambiente: { speechSynthesis: sintese, SpeechSynthesisUtterance: Frase },
    aoEstado: (estado) => estados.push(estado),
  });
  return {
    leitor,
    falas,
    estados,
    ouvintes,
    sintese,
    cancelamentos: () => cancelamentos,
    trocarVozes: (novas) => {
      lista = novas;
      ouvintes.get("voiceschanged")?.();
    },
  };
}

test("prefere voz feminina identificável do idioma exato, sem escolher outro idioma", () => {
  assert.equal(selecionarVoz(vozes, "pt-BR"), vozes[1]);
  assert.equal(selecionarVoz(vozes, "en-US"), vozes[2]);
  assert.equal(selecionarVoz(vozes, "es-ES"), vozes[3]);
  assert.equal(selecionarVoz(vozes, "fr-FR"), null);
  const americana = { name: "Voz padrão", lang: "en-US" };
  assert.equal(
    selecionarVoz([{ name: "Samantha", lang: "en-GB" }, americana], "en-US"),
    americana,
  );
  assert.equal(
    selecionarVoz([{ name: "Helena", lang: "es_MX" }], "es-ES").name,
    "Helena",
  );
});

for (const [idioma, texto, esperado] of [
  ["pt-BR", "SETE", "sete"],
  ["en-US", "SEVEN", "seven"],
  ["es-ES", "SIETE", "siete"],
]) {
  test(`leitura ${idioma}: somente o texto da opção, velocidade calma e eventos de conclusão`, () => {
    const ambiente = navegador();
    ambiente.leitor.falar(texto, idioma);
    const frase = ambiente.falas[0];
    assert.equal(frase.text, esperado);
    assert.equal(frase.lang, idioma);
    assert.equal(frase.voice.lang, idioma);
    assert.equal(frase.rate, 0.9);
    assert.equal(frase.pitch, 1);
    assert.equal(frase.volume, 1);
    assert.equal(ambiente.estados.at(-1).status, "preparando");
    frase.onstart();
    assert.deepEqual(ambiente.estados.at(-1), {
      status: "falando",
      texto,
      erro: null,
    });
    frase.onend();
    assert.deepEqual(ambiente.estados.at(-1), {
      status: "ocioso",
      texto: null,
      erro: null,
    });
    ambiente.leitor.destruir();
  });
}

test("cliques consecutivos substituem a fala, ignoram eventos antigos e permitem repetir", () => {
  const ambiente = navegador();
  ambiente.leitor.falar("SETE", "pt-BR");
  const antiga = ambiente.falas[0];
  const inicioAntigo = antiga.onstart,
    erroAntigo = antiga.onerror;
  ambiente.leitor.falar("CINCO", "pt-BR");
  assert.equal(ambiente.cancelamentos(), 1);
  assert.equal(antiga.onend, null);
  inicioAntigo();
  erroAntigo({ error: "interrupted" });
  assert.equal(ambiente.estados.at(-1).texto, "CINCO");
  ambiente.leitor.falar("CINCO", "pt-BR");
  assert.equal(ambiente.falas.length, 3);
  assert.equal(ambiente.cancelamentos(), 2);
  ambiente.leitor.destruir();
});

test("sair ou trocar rodada cancela a fala, remove listener e impede notificações tardias", () => {
  const ambiente = navegador();
  ambiente.leitor.falar("BEE", "en-US");
  const fim = ambiente.falas[0].onend;
  const total = ambiente.estados.length;
  ambiente.leitor.destruir();
  assert.equal(ambiente.cancelamentos(), 1);
  assert.equal(ambiente.ouvintes.size, 0);
  fim();
  ambiente.leitor.falar("BEE", "en-US");
  assert.equal(ambiente.estados.length, total);
  assert.equal(ambiente.falas.length, 1);
});

test("lista de vozes pode carregar depois; sem lista o navegador recebe o idioma solicitado", () => {
  const ambiente = navegador([]);
  ambiente.leitor.falar("BEE", "en-US");
  assert.equal(ambiente.falas[0].lang, "en-US");
  assert.equal(ambiente.falas[0].voice, undefined);
  ambiente.trocarVozes(vozes);
  ambiente.leitor.falar("BEE", "en-US");
  assert.equal(ambiente.falas[1].voice, vozes[2]);
  ambiente.leitor.destruir();
});

for (const [idioma, texto] of [
  ["en-US", "SEVEN"],
  ["es-ES", "SIETE"],
]) {
  test(`somente vozes portuguesas enumeradas: ainda solicita leitura ${idioma} ao navegador`, () => {
    const ambiente = navegador(vozes.filter((voz) => voz.lang === "pt-BR"));
    ambiente.leitor.falar(texto, idioma);
    assert.equal(ambiente.falas.length, 1);
    assert.equal(ambiente.falas[0].lang, idioma);
    assert.equal(ambiente.falas[0].voice, undefined);
    assert.equal(ambiente.estados.at(-1).erro, null);
    // Indisponibilidade só é mostrada quando o próprio sintetizador falha.
    ambiente.falas[0].onerror({ error: "language-unavailable" });
    assert.equal(ambiente.estados.at(-1).erro, "language-unavailable");
    ambiente.leitor.destruir();
  });
}

test("ausência de API não quebra o jogo e erros de áudio permitem tentar novamente", () => {
  const leitor = criarLeitorNavegador({ ambiente: {} });
  assert.equal(leitor.disponivel, false);
  assert.doesNotThrow(() => {
    leitor.falar("SETE", "pt-BR");
    leitor.destruir();
  });
  const ambiente = navegador();
  ambiente.leitor.falar("SETE", "pt-BR");
  ambiente.falas[0].onerror({ error: "network" });
  assert.equal(ambiente.estados.at(-1).erro, "network");
  ambiente.leitor.falar("SETE", "pt-BR");
  assert.equal(ambiente.falas.length, 2);
  ambiente.leitor.destruir();
});

test("falha síncrona de reprodução é apresentada e sintetizador pausado é retomado", () => {
  const ambiente = navegador();
  ambiente.sintese.paused = true;
  ambiente.leitor.falar("SETE", "pt-BR");
  assert.equal(ambiente.sintese.paused, false);
  ambiente.sintese.speak = () => {
    throw new Error("Indisponível");
  };
  assert.doesNotThrow(() => ambiente.leitor.falar("SETE", "pt-BR"));
  assert.equal(ambiente.estados.at(-1).erro, "falha");
  ambiente.leitor.destruir();
});
