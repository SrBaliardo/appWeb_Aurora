import { construirRodada, construirPosicao } from "./builders/rodada.js";
import {
  posicionarCena,
  avaliarHistoria,
  historiaCompleta,
  historiaPreenchida,
} from "./regras.js";

const operacoes = {
  novaRodada: construirRodada,
  posicionar: (cenas, ordem, id, destino) =>
    posicionarCena(cenas, ordem, id, construirPosicao(destino)),
  avaliar: avaliarHistoria,
  concluiu: historiaCompleta,
  preenchida: historiaPreenchida,
};

export function useHistorias() {
  return operacoes;
}
