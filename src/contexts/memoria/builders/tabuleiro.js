import { embaralhar } from "../../../utils/aleatorio.js";
import { TEMAS } from "../constantes.js";
import { LEGENDAS } from "../traducoes.js";
import { consultarNome } from "../../palavras/index.js";

export function construirTabuleiro(
  temaId,
  random = Math.random,
  idioma = "pt-BR",
) {
  const tema = TEMAS.find((item) => item.id === temaId);
  if (!tema) throw new Error("Tema de memória desconhecido.");
  const indice = idioma === "en-US" ? 0 : idioma === "es-ES" ? 1 : -1;

  return embaralhar(
    tema.cartas.flatMap(([par, figura, original]) => {
      const chave =
        temaId === "brinquedos" && par === "urso" ? "urso-pelucia" : par;
      const nome =
        indice < 0
          ? original
          : LEGENDAS[chave]?.[indice] || consultarNome(par, original, idioma);

      return [0, 1].map((copia) => ({
        id: `${par}-${copia}`,
        par,
        figura,
        nome,
      }));
    }),
    random,
  );
}
