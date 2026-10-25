import { CENARIOS } from "./constantes.js";

export function cenariosDoNivel(nivel) {
  return CENARIOS.filter((cenario) => cenario.nivel === nivel);
}

export function quantidadePorGrupo(nivel) {
  return nivel === "dificil" ? 6 : 2;
}

export function avaliarDestino(rodada, organizados, itemId, grupoId) {
  const item = rodada.itens.find((figura) => figura.id === itemId);
  if (
    !item ||
    organizados.includes(itemId) ||
    !rodada.grupos.some((grupo) => grupo.id === grupoId)
  )
    return "ignorar";
  return item.grupo === grupoId ? "acerto" : "erro";
}

export function concluiuClassificacao(rodada, organizados) {
  return (
    rodada.itens.length > 0 &&
    rodada.itens.every((item) => organizados.includes(item.id))
  );
}
