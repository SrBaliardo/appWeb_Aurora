import { HISTORIAS } from "../constantes.js";
import { cenasDoNivel } from "../regras.js";
import { embaralhar, sortearSemRepetir } from "../../../utils/aleatorio.js";

export function construirPosicao(destino) {
  return typeof destino === "number" ||
    (typeof destino === "string" && /^\d+$/.test(destino))
    ? Number(destino)
    : NaN;
}

export function construirRodada(
  anterior,
  random = Math.random,
  nivel = "facil",
) {
  const historia = sortearSemRepetir(HISTORIAS, anterior, random);
  const cenas = cenasDoNivel(historia, nivel).map((cena, indice) => {
    const [figura, texto, narracao] = cena;
    return {
      id: `${historia.id}-${indice}`,
      figura,
      texto,
      narracao,
      etapaIlustracao: historia.cenas.indexOf(cena),
    };
  });

  return {
    id: historia.id,
    titulo: historia.titulo,
    cenas,
    embaralhadas: embaralhar(cenas, random),
    slides: [
      {
        id: "capa",
        capa: true,
        figura: "📖",
        texto: historia.titulo,
        narracao: "Uma pequena aventura da Aurora e sua turma.",
        etapaIlustracao: -1,
      },
      ...cenas,
    ],
  };
}
