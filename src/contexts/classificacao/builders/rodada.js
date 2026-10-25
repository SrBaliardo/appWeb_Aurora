import { cenariosDoNivel, quantidadePorGrupo } from "../regras.js";
import { embaralhar, sortearSemRepetir } from "../../../utils/aleatorio.js";

export function construirRodada(
  anterior,
  random = Math.random,
  nivel = "facil",
) {
  const cenario = sortearSemRepetir(cenariosDoNivel(nivel), anterior, random);
  const itens = cenario.grupos.flatMap((grupo) =>
    embaralhar(grupo.itens, random)
      .slice(0, quantidadePorGrupo(nivel))
      .map(([id, figura, nome]) => ({ id, figura, nome, grupo: grupo.id })),
  );

  return {
    id: cenario.id,
    grupos: cenario.grupos.map(({ id, nome, figura }) => ({
      id,
      nome,
      figura,
    })),
    itens: embaralhar(itens, random),
  };
}
