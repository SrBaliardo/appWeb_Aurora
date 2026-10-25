import { construirRodada } from "./builders/rodada.js";
import { avaliarResultado } from "./regras.js";

const operacoes = { novaRodada: construirRodada, avaliar: avaliarResultado };

export function useMatematica() {
  return operacoes;
}
