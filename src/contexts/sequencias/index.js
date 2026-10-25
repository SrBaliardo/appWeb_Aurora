import { construirRodada } from "./builders/rodada.js";
import { avaliarSequencia } from "./regras.js";

const operacoes = { novaRodada: construirRodada, avaliar: avaliarSequencia };

export function useSequencias() {
  return operacoes;
}
