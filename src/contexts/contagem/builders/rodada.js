import { FIGURAS } from "../constantes.js";
import { contarAlvo, limiteDaCena } from "../regras.js";
import { embaralhar, sortearSemRepetir } from "../../../utils/aleatorio.js";

export function construirRodada(
  anterior,
  random = Math.random,
  nivel = "facil",
) {
  const alvo = sortearSemRepetir(FIGURAS, anterior, random);
  const limite = limiteDaCena(nivel);
  const total = 1 + Math.floor(random() * limite);
  const outras = FIGURAS.filter((item) => item.id !== alvo.id);
  const figuras = [
    ...Array.from({ length: total }, () => alvo),
    ...Array.from(
      { length: limite - total },
      () => outras[Math.floor(random() * outras.length)],
    ),
  ];
  const cena = embaralhar(figuras, random).map((item, indice) => ({
    ...item,
    tipo: item.id,
    id: `figura-${indice}`,
  }));
  const resposta = contarAlvo(cena, alvo.id);
  const vizinhos = Array.from(
    { length: limite + 1 },
    (_, valor) => valor,
  ).filter((valor) => valor !== resposta && Math.abs(valor - resposta) <= 4);

  return {
    id: alvo.id,
    alvo,
    cena,
    resposta,
    pergunta: "Quantos itens iguais ao modelo há na cena?",
    opcoes: embaralhar(
      [resposta, ...embaralhar(vizinhos, random).slice(0, 3)],
      random,
    ).map((valor) => ({ id: String(valor), texto: String(valor) })),
    dicas: [
      "Conte uma figura de cada vez, sem repetir.",
      "Comece pela primeira linha e depois passe para a próxima.",
      "Você pode apontar para cada figura enquanto conta.",
    ].slice(0, nivel === "dificil" ? 1 : 3),
    confirmacao: "Muito bem! Você contou todas as figuras do modelo!",
  };
}
