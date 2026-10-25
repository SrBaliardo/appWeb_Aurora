import { ALFABETO } from "./constantes.js";
import {
  construirLacunas,
  construirPalavra,
  normalizarLetras,
} from "./builders/rodada.js";
import { avaliarLacunas, obterDicas } from "./regras.js";
import { traduzirNome } from "./builders/idioma.js";

const operacoes = {
  alfabeto: ALFABETO,
  novaRodada: construirLacunas,
  avaliar: avaliarLacunas,
  dicas: obterDicas,
  normalizarEntrada: normalizarLetras,
};

const alfabetos = {
  "pt-BR": ALFABETO,
  "en-US": ALFABETO,
  "es-ES": [..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"],
};
const operacoesPorIdioma = Object.fromEntries(
  Object.keys(alfabetos).map((idioma) => [
    idioma,
    {
      ...operacoes,
      alfabeto: alfabetos[idioma],
      normalizarEntrada: (texto) => normalizarLetras(texto, idioma),
    },
  ]),
);

export function usePalavras(idioma = "pt-BR") {
  return operacoesPorIdioma[idioma] || operacoesPorIdioma["pt-BR"];
}

export function sortearPalavra(anterior, random, nivel, idioma) {
  return construirPalavra(anterior, random, nivel, idioma);
}

export function normalizarEntrada(texto, idioma) {
  return normalizarLetras(texto, idioma);
}

export function consultarDicas(palavra, quantidade, nivel) {
  return obterDicas(palavra, quantidade, nivel);
}

export function consultarAlfabeto(idioma = "pt-BR") {
  return alfabetos[idioma] || ALFABETO;
}

export function consultarNome(id, original, idioma) {
  return traduzirNome(id, original, idioma);
}
