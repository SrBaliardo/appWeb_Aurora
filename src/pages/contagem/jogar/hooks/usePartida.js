import { useContagem } from "../../../../contexts/contagem/index.js";
import { useRodadaDeOpcoes } from "../../../../hooks/useRodadaDeOpcoes.js";

export function usePartida(nivel) {
  return useRodadaDeOpcoes(useContagem(), nivel);
}
