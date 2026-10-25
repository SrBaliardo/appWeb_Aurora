export function avaliarEscrita(rodada, letras) {
  const indices = rodada.indices || rodada.letras.map((_, i) => i);
  const posicoes = indices.map(
    (i) => i === null || letras[i] === rodada.letras[i],
  );
  return {
    posicoes,
    venceu: letras.length === rodada.letras.length && posicoes.every(Boolean),
    proxima: letras.length,
  };
}

export function podeAdicionarLetra(rodada, letras, letra) {
  return (
    typeof letra === "string" &&
    letra.length === 1 &&
    letras.length < rodada.letras.length &&
    rodada.letras[letras.length] === letra
  );
}
