import { construirRodada } from "./builders/rodada.js";
import { avaliarCor } from "./regras.js";

const operacoes = { novaRodada: construirRodada, avaliar: avaliarCor };

export function useCores() {
  return operacoes;
}
