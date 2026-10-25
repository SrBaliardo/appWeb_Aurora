import { construirRodada } from "./builders/rodada.js";
import { avaliarEscrita, podeAdicionarLetra } from "./regras.js";
import { consultarAlfabeto, normalizarEntrada } from "../palavras/index.js";

const operacoes = {
  novaRodada: construirRodada,
  avaliar: avaliarEscrita,
  podeAdicionar: podeAdicionarLetra,
  alfabeto: consultarAlfabeto(),
  normalizarEntrada,
};
const operacoesPorIdioma = Object.fromEntries(
  ["pt-BR", "en-US", "es-ES"].map((idioma) => [
    idioma,
    {
      ...operacoes,
      alfabeto: consultarAlfabeto(idioma),
      normalizarEntrada: (texto) => normalizarEntrada(texto, idioma),
    },
  ]),
);

export function useEscrita(idioma = "pt-BR") {
  return operacoesPorIdioma[idioma] || operacoesPorIdioma["pt-BR"];
}
