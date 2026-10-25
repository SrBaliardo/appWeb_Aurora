export function selecionarVocabulario(palavras, nivel = "facil") {
  return palavras.filter((palavra) =>
    nivel === "dificil" ? palavra.texto.length >= 7 : palavra.texto.length <= 8,
  );
}

export function quantidadeLetrasOcultas(letras, nivel = "facil") {
  const diferentes = new Set(letras).size;
  return Math.max(
    1,
    Math.min(
      nivel === "dificil" ? 3 : letras.length <= 3 ? 1 : 2,
      diferentes - 1,
    ),
  );
}

export function avaliarLacunas(rodada, tentativas) {
  const descobertas = tentativas.filter((letra) =>
    rodada.ocultas.includes(letra),
  );

  return {
    completa: rodada.ocultas.every((letra) => descobertas.includes(letra)),
    venceu: rodada.ocultas.every((letra) => descobertas.includes(letra)),
    encerrou: rodada.ocultas.every((letra) => descobertas.includes(letra)),
    corretas: descobertas,
    bloqueadas: [
      ...new Set(
        rodada.letras.filter((letra) => !rodada.ocultas.includes(letra)),
      ),
    ],
    posicoes: rodada.letras.map(
      (letra) => !rodada.ocultas.includes(letra) || descobertas.includes(letra),
    ),
  };
}

export function obterDicas(palavra, quantidade, nivel = "facil") {
  const dicas = nivel === "dificil" ? [palavra.dicas[0]] : palavra.dicas;
  return dicas.slice(0, quantidade);
}
