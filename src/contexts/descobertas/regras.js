export function selecionarFiguras(figuras, nivel, tipos) {
  return figuras.filter(
    (item) => item.nivel === nivel && (!tipos || tipos.includes(item.tipo)),
  );
}

export function limitarDicas(dicas, nivel) {
  return nivel === "dificil" ? dicas.slice(0, 1) : dicas;
}

export function avaliarDescoberta(rodada, resposta) {
  return rodada.resposta === resposta;
}
