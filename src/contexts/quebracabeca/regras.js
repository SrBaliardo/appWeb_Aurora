export function tamanhoDoNivel(nivel) {
  return nivel === "dificil" ? 4 : 3;
}

export function avaliarEncaixe(pecas, encaixadas, pecaId, destino) {
  const peca = pecas.find((item) => item.id === pecaId);
  if (
    !peca ||
    !Number.isInteger(destino) ||
    destino < 0 ||
    destino >= pecas.length ||
    encaixadas.includes(pecaId)
  )
    return "ignorar";
  if (
    encaixadas.some(
      (id) => pecas.find((item) => item.id === id)?.posicao === destino,
    )
  )
    return "ignorar";
  return peca.posicao === destino ? "acerto" : "erro";
}

export function concluiu(pecas, encaixadas) {
  return (
    pecas.length > 0 && pecas.every((peca) => encaixadas.includes(peca.id))
  );
}
