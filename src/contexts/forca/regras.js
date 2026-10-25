export const LIMITE_ERROS = 6;

export function avaliarForca(rodada, tentativas) {
  const unicas = [...new Set(tentativas)];
  const erros = unicas.filter((letra) => !rodada.letras.includes(letra)).length;
  const posicoes = rodada.letras.map(
    (letra) => !/[A-ZÑ]/.test(letra) || unicas.includes(letra),
  );
  const venceu = posicoes.every(Boolean);
  const encerrou = venceu || erros >= LIMITE_ERROS;
  const corretas = unicas.filter((letra) => rodada.letras.includes(letra));

  return {
    erros,
    restantes: Math.max(0, LIMITE_ERROS - erros),
    posicoes,
    venceu,
    encerrou,
    corretas,
  };
}
