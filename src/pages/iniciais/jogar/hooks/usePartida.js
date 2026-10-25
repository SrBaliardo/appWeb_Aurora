import { useIniciais } from "../../../../contexts/iniciais/index.js";
import { useRodadaDeOpcoes } from "../../../../hooks/useRodadaDeOpcoes.js";

export function usePartida(nivel, idioma) {
  return useRodadaDeOpcoes(useIniciais(), nivel, idioma);
}
