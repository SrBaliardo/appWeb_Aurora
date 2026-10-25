import { usePalavras } from "../../../../contexts/palavras/index.js";
import { useRodadaDeLetras } from "../../../../hooks/useRodadaDeLetras.js";

export function usePartida(nivel, idioma = "pt-BR") {
  return useRodadaDeLetras(usePalavras(idioma), nivel, idioma);
}
