import { embaralhar, sortearSemRepetir } from "../../../utils/aleatorio.js";
import { CORES, CORES_DIFICEIS, FORMAS } from "../constantes.js";
import { NOMES_CORES } from "../traducoes.js";

export function construirRodada(
  anterior,
  random = Math.random,
  nivel = "facil",
  idioma = "pt-BR",
) {
  const indice = idioma === "en-US" ? 0 : idioma === "es-ES" ? 1 : -1;
  const banco = (nivel === "dificil" ? CORES_DIFICEIS : CORES).map((cor) => ({
    ...cor,
    nome: indice < 0 ? cor.nome : NOMES_CORES[cor.id][indice],
  }));
  const cor = sortearSemRepetir(banco, anterior, random);
  const outras = embaralhar(
    banco.filter((item) => item.id !== cor.id),
    random,
  ).slice(0, 3);

  return {
    cor,
    forma: FORMAS[Math.floor(random() * FORMAS.length)],
    opcoes: embaralhar([cor, ...outras], random),
  };
}
