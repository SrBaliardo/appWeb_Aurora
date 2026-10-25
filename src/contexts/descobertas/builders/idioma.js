import { consultarNome } from "../../palavras/index.js";
import {
  FIGURAS_TRADUZIDAS,
  NUMEROS_TRADUZIDOS,
  DEZENAS_TRADUZIDAS,
} from "../traducoes.js";

export function traduzirFigura(item, idioma = "pt-BR") {
  const indice = idioma === "en-US" ? 0 : idioma === "es-ES" ? 1 : -1;
  const texto =
    indice < 0
      ? item.texto
      : FIGURAS_TRADUZIDAS[item.id]?.[indice] ||
        consultarNome(item.id, item.texto, idioma);
  return { ...item, texto, idioma };
}

export function nomeNumero(valor, original, idioma = "pt-BR") {
  return (
    NUMEROS_TRADUZIDOS[idioma]?.[valor] ||
    DEZENAS_TRADUZIDAS[idioma]?.[valor] ||
    original
  );
}
