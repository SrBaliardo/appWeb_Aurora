export function descreverObjeto(id, texto, figura, dicas, nivel = "facil") {
  return { id, texto, figura, dicas, nivel, tipo: "objeto" };
}

export function descreverForma(id, texto, dicas, nivel = "facil") {
  return {
    id,
    texto,
    figura: { tipo: "forma", forma: id },
    dicas,
    nivel,
    tipo: "forma",
  };
}
