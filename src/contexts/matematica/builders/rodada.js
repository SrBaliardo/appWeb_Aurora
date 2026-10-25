import { embaralhar, sortearSemRepetir } from "../../../utils/aleatorio.js";
import { calcular, dicasDaConta } from "../regras.js";

export function construirRodada(
  anterior,
  random = Math.random,
  nivel = "facil",
) {
  const inteiro = (min, max) => min + Math.floor(random() * (max - min + 1));
  let contas;
  if (nivel === "dificil") {
    const a = inteiro(10, 99),
      b = inteiro(10, 99),
      maior = inteiro(20, 99),
      menor = inteiro(10, maior - 10);
    const vezes = inteiro(2, 9),
      multiplicando = inteiro(10, 22),
      divisor = inteiro(2, 5),
      quociente = inteiro(10, 19);
    contas = [
      [a, b, "+"],
      [maior, menor, "−"],
      [multiplicando, vezes, "×"],
      [divisor * quociente, divisor, "÷"],
    ];
  } else {
    const a = inteiro(0, 9),
      b = inteiro(0, 9 - a),
      maior = inteiro(0, 9),
      menor = inteiro(0, maior);
    contas = [
      [a, b, "+"],
      [maior, menor, "−"],
    ];
  }
  const conta = sortearSemRepetir(
    contas.map(([a, b, operacao]) => ({
      id: `${a}${operacao}${b}`,
      a,
      b,
      operacao,
    })),
    anterior,
    random,
  );
  const { a, b, operacao } = conta;
  const resultado = calcular(a, b, operacao);
  const limite = nivel === "dificil" ? 199 : 9;
  const vizinhos = Array.from(
    { length: 7 },
    (_, i) => resultado + i - 3,
  ).filter((valor) => valor >= 0 && valor <= limite && valor !== resultado);
  const opcoes = embaralhar(
    [resultado, ...embaralhar(vizinhos, random).slice(0, 3)],
    random,
  ).map((valor) => ({ id: String(valor), texto: String(valor) }));

  return {
    ...conta,
    conta: `${a} ${operacao} ${b}`,
    pergunta: "Qual é o resultado?",
    resultado,
    opcoes,
    dicas: dicasDaConta(a, b, operacao, nivel),
    confirmacao: `Muito bem! ${a} ${operacao} ${b} = ${resultado}.`,
  };
}
