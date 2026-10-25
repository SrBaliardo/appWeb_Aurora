import { TEMAS } from "./constantes.js";
import { construirTabuleiro } from "./builders/tabuleiro.js";
import {
  avaliarPar,
  concluiuMemoria,
  podeVirar,
  configuracaoNivel,
} from "./regras.js";

const operacoes = {
  temas: TEMAS.map(({ id, nome, emoji }) => ({ id, nome, emoji })),
  novoTabuleiro: construirTabuleiro,
  avaliarPar,
  podeVirar,
  concluiu: concluiuMemoria,
  configuracaoNivel,
  temaPadrao: "aurora",
};

export function useMemoria() {
  return operacoes;
}
