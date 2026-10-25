import { embaralhar, sortearSemRepetir } from "../../../utils/aleatorio.js";
import { PALAVRAS } from "../constantes.js";
import { PISTAS_INICIAIS } from "../pistasIniciais.js";
import { quantidadeLetrasOcultas, selecionarVocabulario } from "../regras.js";
import { traduzirPalavra } from "./idioma.js";

export function normalizarLetras(texto, idioma = "pt-BR") {
  const partes =
    idioma === "es-ES" ? texto.normalize("NFC").split(/ñ/i) : [texto];
  return partes
    .map((parte) =>
      parte
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase(),
    )
    .join("Ñ");
}

export function construirPalavra(
  anterior,
  random = Math.random,
  nivel = "facil",
  idioma = "pt-BR",
) {
  const banco = PALAVRAS.map((palavra) => traduzirPalavra(palavra, idioma));
  const palavra = sortearSemRepetir(
    selecionarVocabulario(banco, nivel),
    anterior,
    random,
  );
  return {
    ...palavra,
    pistaInicial: PISTAS_INICIAIS[palavra.id],
    letras: [...normalizarLetras(palavra.texto, idioma)],
  };
}

export function construirLacunas(
  anterior,
  random = Math.random,
  nivel = "facil",
  idioma = "pt-BR",
) {
  const palavra = construirPalavra(anterior, random, nivel, idioma);
  const letras = palavra.letras.filter((letra) => /[A-ZÑ]/.test(letra));
  const quantidade = quantidadeLetrasOcultas(letras, nivel);
  const ocultas = embaralhar([...new Set(letras)], random).slice(0, quantidade);
  return { ...palavra, ocultas };
}
