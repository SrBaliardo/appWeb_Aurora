import { useForca } from "../../../../contexts/forca/index.js";
import { useRodadaDeLetras } from "../../../../hooks/useRodadaDeLetras.js";

export function usePartida(nivel, idioma = "pt-BR") {
  return useRodadaDeLetras(useForca(idioma), nivel, idioma);
}
