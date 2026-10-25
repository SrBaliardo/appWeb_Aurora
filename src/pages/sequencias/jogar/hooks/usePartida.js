import { useSequencias } from "../../../../contexts/sequencias/index.js";
import { useRodadaDeOpcoes } from "../../../../hooks/useRodadaDeOpcoes.js";

export function usePartida(nivel) {
  return useRodadaDeOpcoes(useSequencias(), nivel);
}
