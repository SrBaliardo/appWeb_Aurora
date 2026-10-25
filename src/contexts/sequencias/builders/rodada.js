import { embaralhar, sortearSemRepetir } from "../../../utils/aleatorio.js";
import { FIGURAS, FORMAS, PADROES, NOMES } from "../constantes.js";
import { valorNoPadrao, valorNumerico } from "../regras.js";

export function construirRodada(
  anterior,
  random = Math.random,
  nivel = "facil",
) {
  const tipo = sortearSemRepetir(
    (nivel === "dificil"
      ? ["aab", "abc", "abbc", "numeros-2", "numeros-3", "numeros-5"]
      : ["frutas", "bosque"]
    ).map((id) => ({ id })),
    anterior,
    random,
  ).id;
  let serie, resposta, alternativas, dicas;
  if (tipo.startsWith("numeros")) {
    const passo = Number(tipo.split("-")[1]),
      inicio = 1 + Math.floor(random() * 6);
    const valores = Array.from({ length: 6 }, (_, posicao) =>
      valorNumerico(inicio, passo, posicao),
    );
    resposta = String(valores[5]);
    serie = valores.slice(0, -1).map((valor) => ({ tipo: "numero", valor }));
    alternativas = [
      valores[5],
      valores[5] - 1,
      valores[5] + 1,
      valores[5] + passo + 1,
    ].map(String);
    dicas = [`De um número para o outro, somamos ${passo}.`];
  } else {
    const figuras = embaralhar(
      nivel === "dificil" ? FORMAS : FIGURAS[tipo],
      random,
    );
    const padrao =
      nivel === "dificil"
        ? PADROES[["aab", "abc", "abbc"].indexOf(tipo)]
        : [0, 1];
    const total = padrao.length * 2;
    serie = Array.from(
      { length: total - 1 },
      (_, posicao) => figuras[valorNoPadrao(padrao, posicao)],
    );
    resposta = figuras[valorNoPadrao(padrao, total - 1)];
    alternativas = [
      resposta,
      ...figuras.filter((figura) => figura !== resposta).slice(0, 3),
    ];
    dicas = [
      "Observe a ordem das primeiras figuras.",
      "Um grupo de figuras se repete na mesma ordem.",
      "Compare o espaço vazio com o mesmo lugar do primeiro grupo.",
    ];
  }

  return {
    id: tipo,
    serie: serie.map((figura) => ({
      figura,
      descricao: typeof figura === "string" ? NOMES[figura] : "",
    })),
    resposta,
    figuraFinal: {
      figura: /^\d+$/.test(resposta)
        ? { tipo: "numero", valor: Number(resposta) }
        : resposta,
      descricao: NOMES[resposta] || "",
    },
    pergunta: "O que vem depois?",
    opcoes: embaralhar(alternativas, random).map((texto) => ({
      id: texto,
      texto,
      descricao: NOMES[texto],
    })),
    dicas: dicas.slice(0, nivel === "dificil" ? 1 : 3),
    confirmacao: "Isso! Você descobriu o segredo da sequência!",
  };
}
