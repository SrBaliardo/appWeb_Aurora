import { useMatematica } from "../../../../contexts/matematica/index.js";
import { useRodadaDeOpcoes } from "../../../../hooks/useRodadaDeOpcoes.js";

export function usePartida(nivel, idioma = "pt-BR") {
  return useRodadaDeOpcoes(useMatematica(), nivel, idioma);
}
