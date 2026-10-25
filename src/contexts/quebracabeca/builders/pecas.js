import { embaralhar } from "../../../utils/aleatorio.js";
import { tamanhoDoNivel } from "../regras.js";

function borda(inicio, fim, normal, encaixe) {
  const ponto = (proporcao, altura = 0) =>
    `${inicio[0] + (fim[0] - inicio[0]) * proporcao + normal[0] * altura * encaixe} ${inicio[1] + (fim[1] - inicio[1]) * proporcao + normal[1] * altura * encaixe}`;
  if (!encaixe) return `L${ponto(1)}`;
  return `L${ponto(0.35)} C${ponto(0.45)} ${ponto(0.35, 18)} ${ponto(0.5, 18)} C${ponto(0.65, 18)} ${ponto(0.55)} ${ponto(0.65)} L${ponto(1)}`;
}

export function construirPecas(nivel, random = Math.random) {
  const lado = tamanhoDoNivel(nivel);
  const sinal = (linha, coluna) => ((linha + coluna) % 2 ? 1 : -1);
  const pecas = Array.from({ length: lado * lado }, (_, posicao) => {
    const linha = Math.floor(posicao / lado),
      coluna = posicao % lado;
    const bordas = [
      linha ? -sinal(linha - 1, coluna) : 0,
      coluna < lado - 1 ? sinal(linha, coluna) : 0,
      linha < lado - 1 ? sinal(linha, coluna) : 0,
      coluna ? -sinal(linha, coluna - 1) : 0,
    ];
    const caminho =
      "M0 0 " +
      [
        borda([0, 0], [100, 0], [0, -1], bordas[0]),
        borda([100, 0], [100, 100], [1, 0], bordas[1]),
        borda([100, 100], [0, 100], [0, 1], bordas[2]),
        borda([0, 100], [0, 0], [-1, 0], bordas[3]),
      ].join(" ") +
      " Z";
    return { id: `peca-${posicao}`, posicao, linha, coluna, bordas, caminho };
  });

  return { lado, pecas: embaralhar(pecas, random) };
}
