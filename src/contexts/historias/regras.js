export function cenasDoNivel(historia, nivel) {
  return nivel === "dificil"
    ? historia.cenas
    : historia.facil.map((indice) => historia.cenas[indice]);
}

export function posicionarCena(cenas, ordem, id, posicao) {
  if (
    !cenas.some((cena) => cena.id === id) ||
    !Number.isInteger(posicao) ||
    posicao < 0 ||
    posicao >= cenas.length
  )
    return null;
  const resultado = Array.from(
    { length: cenas.length },
    (_, indice) => ordem[indice] || null,
  );
  const origem = resultado.indexOf(id);
  if (origem >= 0) resultado[origem] = resultado[posicao];
  resultado[posicao] = id;
  return resultado;
}

export function avaliarHistoria(rodada, ordem) {
  return rodada.cenas.map((cena, indice) => ordem[indice] === cena.id);
}

export function historiaCompleta(rodada, ordem) {
  return (
    rodada.cenas.length > 0 && avaliarHistoria(rodada, ordem).every(Boolean)
  );
}

export function historiaPreenchida(rodada, ordem) {
  return (
    rodada.cenas.length > 0 &&
    rodada.cenas.every((cena) => ordem.includes(cena.id))
  );
}
