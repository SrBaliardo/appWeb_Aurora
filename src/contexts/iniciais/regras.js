export function inicioDaPalavra(palavra, silabas, nivel) {
  return nivel === "dificil" ? silabas.split("-")[0] : Array.from(palavra)[0];
}

export function participaDoNivel(item, nivel, indice) {
  return (
    nivel !== "dificil" ||
    Boolean(item.dificil && item.silabas[indice].includes("-"))
  );
}

export function avaliarInicial(rodada, resposta) {
  return (
    rodada.opcoes.some((opcao) => opcao.id === resposta) &&
    rodada.resposta === resposta
  );
}
