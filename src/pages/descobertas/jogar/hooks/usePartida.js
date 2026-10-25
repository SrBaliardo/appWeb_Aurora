import { useDescobertas } from "../../../../contexts/descobertas/index.js";
import { useRodadaDeOpcoes } from "../../../../hooks/useRodadaDeOpcoes.js";

export function usePartida(nivel, idioma = "pt-BR") {
  return useRodadaDeOpcoes(useDescobertas(), nivel, idioma);
}
