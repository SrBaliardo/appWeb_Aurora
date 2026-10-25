import { construirRodada } from "./builders/rodada.js";
import { avaliarContagem } from "./regras.js";

const operacoes = { novaRodada: construirRodada, avaliar: avaliarContagem };

export function useContagem() {
  return operacoes;
}
