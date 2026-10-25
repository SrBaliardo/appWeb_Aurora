import { construirRodada } from "./builders/rodada.js";
import { avaliarDestino, concluiuClassificacao } from "./regras.js";

const operacoes = {
  novaRodada: construirRodada,
  avaliar: avaliarDestino,
  concluiu: concluiuClassificacao,
};

export function useClassificacao() {
  return operacoes;
}
