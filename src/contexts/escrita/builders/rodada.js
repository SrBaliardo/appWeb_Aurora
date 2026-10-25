import { sortearFigura } from "../../descobertas/index.js";
import { normalizarEntrada } from "../../palavras/index.js";

export function construirRodada(
  anterior,
  random = Math.random,
  nivel = "facil",
  idioma = "pt-BR",
) {
  const item = sortearFigura(
    anterior,
    random,
    nivel,
    ["objeto", "numero"],
    idioma,
  );
  const normalizado = [...normalizarEntrada(item.texto, idioma)];
  const letras = normalizado.filter((letra) => /[A-ZÑ]/.test(letra));
  let indice = 0;
  const indices = normalizado.map((letra) =>
    /[A-ZÑ]/.test(letra) ? indice++ : null,
  );

  return {
    ...item,
    letras,
    indices,
    textoExibicao: item.texto,
    pergunta:
      item.tipo === "numero"
        ? "Escreva o nome do número."
        : "Escreva o nome da figura.",
  };
}
