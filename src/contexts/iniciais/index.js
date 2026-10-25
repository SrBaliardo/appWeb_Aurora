import { construirRodada } from "./builders/rodada.js";
import { avaliarInicial } from "./regras.js";

const operacoes = { novaRodada: construirRodada, avaliar: avaliarInicial };

export function useIniciais() {
  return operacoes;
}
