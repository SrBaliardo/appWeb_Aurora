import { PALAVRAS } from "../constantes.js";
import { inicioDaPalavra, participaDoNivel } from "../regras.js";
import { embaralhar, sortearSemRepetir } from "../../../utils/aleatorio.js";

export function construirRodada(
  anterior,
  random = Math.random,
  nivel = "facil",
  idioma = "pt-BR",
) {
  const indice = idioma === "en-US" ? 1 : idioma === "es-ES" ? 2 : 0;
  const banco = PALAVRAS.filter((item) =>
    participaDoNivel(item, nivel, indice),
  ).map((item) => ({
    ...item,
    palavra: item.nomes[indice],
    silabas: item.silabas[indice],
  }));
  const item = sortearSemRepetir(banco, anterior, random);
  const resposta = inicioDaPalavra(item.palavra, item.silabas, nivel);
  const alternativas = [
    ...new Set(
      banco.map((outra) =>
        inicioDaPalavra(outra.palavra, outra.silabas, nivel),
      ),
    ),
  ].filter((texto) => texto !== resposta);

  return {
    id: item.id,
    figura: item.figura,
    palavra: item.palavra,
    resto: item.palavra.slice(resposta.length),
    resposta,
    nivel,
    pergunta:
      nivel === "dificil"
        ? "Qual é a primeira sílaba?"
        : "Qual é a primeira letra?",
    opcoes: embaralhar(
      [resposta, ...embaralhar(alternativas, random).slice(0, 3)],
      random,
    ).map((texto) => ({ id: texto, texto })),
    dicas: [
      `A palavra é ${item.palavra}.`,
      "Observe o começo da palavra.",
      "Compare o início da palavra com as opções.",
    ].slice(0, nivel === "dificil" ? 1 : 3),
    confirmacao: `Muito bem! Você encontrou o começo de ${item.palavra}.`,
  };
}
