import { embaralhar, sortearSemRepetir } from "../../../utils/aleatorio.js";
import { FIGURAS, NUMEROS, DEZENAS } from "../constantes.js";
import { selecionarFiguras, limitarDicas } from "../regras.js";
import { nomeNumero, traduzirFigura } from "./idioma.js";

export function construirBanco(nivel = "facil", idioma = "pt-BR") {
  const valores =
    nivel === "dificil"
      ? [
          ...Array.from({ length: 11 }, (_, i) => i + 10),
          ...Object.keys(DEZENAS).map(Number),
        ]
      : Array.from({ length: 10 }, (_, i) => i);
  const numeros = valores.map((valor) => {
    const texto = nomeNumero(valor, NUMEROS[valor] || DEZENAS[valor], idioma);
    return {
      id: `numero-${valor}`,
      tipo: "numero",
      nivel,
      idioma,
      texto,
      figura: { tipo: "numero", valor },
      dicas: [
        `É o número que vem depois de ${valor - 1}.`,
        valor === 0
          ? "Representa nenhuma unidade."
          : `É maior que ${valor - 1} e menor que ${valor + 1}.`,
        `Seu nome começa com ${texto[0]}.`,
      ],
    };
  });

  const zero = numeros.find((item) => item.figura.valor === 0);
  if (zero) {
    zero.dicas[0] = "Representa nenhuma unidade.";
    zero.dicas[1] = "É menor que um.";
  }
  return [
    ...selecionarFiguras(FIGURAS, nivel).map((item) =>
      traduzirFigura(item, idioma),
    ),
    ...numeros,
  ];
}

export function construirFigura(
  anterior,
  random = Math.random,
  nivel = "facil",
  tipos,
  idioma = "pt-BR",
) {
  const banco = construirBanco(nivel, idioma).filter(
    (item) => !tipos || tipos.includes(item.tipo),
  );
  const item = sortearSemRepetir(banco, anterior, random);
  return { ...item, dicas: limitarDicas(item.dicas, nivel) };
}

export function construirRodada(
  anterior,
  random = Math.random,
  nivel = "facil",
  idioma = "pt-BR",
) {
  const item = construirFigura(anterior, random, nivel, undefined, idioma);
  const outras = embaralhar(
    construirBanco(nivel, idioma).filter(
      (opcao) => opcao.tipo === item.tipo && opcao.id !== item.id,
    ),
    random,
  ).slice(0, 3);
  const pergunta =
    item.tipo === "numero"
      ? "Que número é esse?"
      : item.tipo === "forma"
        ? "Que forma é essa?"
        : "O que é isso?";
  return {
    ...item,
    pergunta,
    resposta: item.id,
    confirmacao: `Isso! É ${item.texto.toLocaleLowerCase("pt-BR")}!`,
    opcoes: embaralhar([item, ...outras], random).map(({ id, texto }) => ({
      id,
      texto,
    })),
  };
}
