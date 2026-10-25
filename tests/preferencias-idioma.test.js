import test from "node:test";
import assert from "node:assert/strict";
import { construirPreferenciasDeIdioma } from "../src/contexts/interface/builders/preferencias.js";
import { selecionarIdiomaPreferido } from "../src/contexts/interface/regras.js";
import { identificarIdiomaInicial } from "../src/contexts/interface/index.js";

test("idioma inicial respeita português, inglês e espanhol com diferentes regiões", () => {
  for (const [informado, esperado] of [
    ["pt-BR", "pt-BR"],
    ["pt", "pt-BR"],
    ["pt-PT", "pt-BR"],
    ["pt-AO", "pt-BR"],
    ["en-US", "en-US"],
    ["en-GB", "en-US"],
    ["en-AU", "en-US"],
    ["en", "en-US"],
    ["es-ES", "es-ES"],
    ["es-MX", "es-ES"],
    ["es-AR", "es-ES"],
    ["es", "es-ES"],
  ])
    assert.equal(
      identificarIdiomaInicial({ languages: [informado] }),
      esperado,
      informado,
    );
});

test("usa o primeiro idioma compatível da lista de preferências, não um país presumido", () => {
  assert.equal(
    identificarIdiomaInicial({ languages: ["es-MX", "en-US", "pt-BR"] }),
    "es-ES",
  );
  assert.equal(
    identificarIdiomaInicial({ languages: ["en-US", "pt-BR"] }),
    "en-US",
  );
  assert.equal(
    identificarIdiomaInicial({ languages: ["fr-FR", "pt-BR", "en-US"] }),
    "pt-BR",
  );
  assert.equal(
    identificarIdiomaInicial({ languages: ["de-DE", "es-ES"] }),
    "es-ES",
  );
});

test("normaliza espaços, maiúsculas e separadores sem aceitar tags malformadas", () => {
  assert.deepEqual(
    construirPreferenciasDeIdioma({
      languages: [" PT_br ", "es-es", "en_us", "en--US", "??", "", null, 8],
    }),
    ["pt-BR", "es-ES", "en-US"],
  );
  assert.equal(
    identificarIdiomaInicial({ languages: ["??", "ES_mx"] }),
    "es-ES",
  );
});

test("navigator.language é utilizado quando a lista não está disponível", () => {
  assert.equal(identificarIdiomaInicial({ language: "pt-BR" }), "pt-BR");
  assert.equal(
    identificarIdiomaInicial({ languages: [], language: "es-ES" }),
    "es-ES",
  );
  assert.equal(
    identificarIdiomaInicial({ languages: "pt-BR", language: "en-US" }),
    "en-US",
  );
});

test("inglês é o fallback quando nenhum idioma compatível está disponível", () => {
  for (const navegador of [
    {},
    null,
    { languages: [] },
    { languages: ["fr-FR", "de-DE", "ja-JP"] },
    { language: "??" },
  ]) {
    assert.equal(identificarIdiomaInicial(navegador), "en-US");
  }
  assert.equal(selecionarIdiomaPreferido([]), "en-US");
});

test("indisponibilidade das informações do navegador não impede a abertura da aplicação", () => {
  const navegador = {
    get languages() {
      throw new Error("Informação indisponível");
    },
  };
  assert.equal(identificarIdiomaInicial(navegador), "en-US");
});
