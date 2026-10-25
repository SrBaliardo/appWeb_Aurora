import {
  consultarAlfabeto,
  consultarDicas,
  normalizarEntrada,
  sortearPalavra,
} from "../palavras/index.js";
import { avaliarForca } from "./regras.js";

const operacoes = {
  alfabeto: consultarAlfabeto(),
  novaRodada: sortearPalavra,
  avaliar: avaliarForca,
  dicas: consultarDicas,
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

export function useForca(idioma = "pt-BR") {
  return operacoesPorIdioma[idioma] || operacoesPorIdioma["pt-BR"];
}
