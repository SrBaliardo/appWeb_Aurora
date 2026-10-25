export function configuracaoNivel(nivel = "facil") {
  return {
    tempoPrevia: nivel === "dificil" ? 1600 : 3200,
    mostrarNomes: nivel !== "dificil",
  };
}

export function avaliarPar(cartas) {
  return (
    cartas.length === 2 &&
    cartas[0].id !== cartas[1].id &&
    cartas[0].par === cartas[1].par
  );
}

export function podeVirar(id, abertas, encontradas, bloqueado) {
  return (
    !bloqueado &&
    abertas.length < 2 &&
    !abertas.includes(id) &&
    !encontradas.includes(id)
  );
}

export function concluiuMemoria(encontradas) {
  return new Set(encontradas).size === 16;
}
