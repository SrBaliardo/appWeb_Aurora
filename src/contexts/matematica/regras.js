export function calcular(a, b, operacao) {
  if (operacao === "+") return a + b;
  if (operacao === "−") return a - b;
  if (operacao === "×") return a * b;
  if (operacao === "÷" && b !== 0) return a / b;
  throw new Error("Operação inválida.");
}

export function avaliarResultado(rodada, resposta) {
  return (
    /^\d+$/.test(String(resposta)) && Number(resposta) === rodada.resultado
  );
}

export function dicasDaConta(a, b, operacao, nivel) {
  const primeira =
    operacao === "+"
      ? "Junte as duas quantidades."
      : operacao === "−"
        ? "Retire a segunda quantidade da primeira."
        : operacao === "×"
          ? `Some ${a} em ${b} grupos iguais.`
          : `Separe ${a} em ${b} grupos iguais.`;
  return nivel === "dificil"
    ? [primeira]
    : [
        primeira,
        operacao === "+"
          ? `Comece em ${a} e conte mais ${b}.`
          : `Comece em ${a} e conte ${b} para trás.`,
        "Você pode contar com os dedos ou desenhar bolinhas.",
      ];
}
