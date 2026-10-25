export function contarAlvo(cena, alvo) {
  return cena.filter((item) => item.tipo === alvo).length;
}

export function limiteDaCena(nivel) {
  return nivel === "dificil" ? 20 : 10;
}

export function avaliarContagem(rodada, resposta) {
  return (
    rodada.opcoes.some((opcao) => opcao.id === resposta) &&
    Number(resposta) === contarAlvo(rodada.cena, rodada.alvo.id)
  );
}
