import { TEMAS } from "./constantes.js";
import { construirPecas } from "./builders/pecas.js";
import { avaliarEncaixe, concluiu } from "./regras.js";

const operacoes = {
  temas: TEMAS,
  novaRodada: construirPecas,
  avaliarEncaixe,
  concluiu,
};

export function useQuebraCabeca() {
  return operacoes;
}
