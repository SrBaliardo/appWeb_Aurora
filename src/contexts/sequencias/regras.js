export function valorNoPadrao(padrao, posicao) {
  return padrao[posicao % padrao.length];
}

export function valorNumerico(inicio, passo, posicao) {
  return inicio + passo * posicao;
}

export function avaliarSequencia(rodada, resposta) {
  return (
    rodada.opcoes.some((opcao) => opcao.id === resposta) &&
    resposta === rodada.resposta
  );
}
