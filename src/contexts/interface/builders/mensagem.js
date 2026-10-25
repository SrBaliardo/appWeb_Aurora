function escapar(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function construirTradutor(mensagens = {}) {
  const modelos = Object.keys(mensagens)
    .filter((chave) => chave.includes("{"))
    .map((chave) => {
      const campos = [...chave.matchAll(/\{(\w+)\}/g)].map((item) => item[1]);
      const partes = chave.split(/\{\w+\}/g).map(escapar);
      return {
        chave,
        campos,
        expressao: new RegExp(`^${partes.join("(.+?)")}$`, "u"),
      };
    });
  const preencher = (texto, valores) =>
    texto.replace(
      /\{(\w+)\}/g,
      (original, campo) => valores[campo] ?? original,
    );

  return (texto, valores) => {
    if (typeof texto !== "string") return texto;
    if (valores) return preencher(mensagens[texto] || texto, valores);
    if (Object.hasOwn(mensagens, texto)) return mensagens[texto];

    for (const modelo of modelos) {
      const achou = texto.match(modelo.expressao);
      if (achou)
        return preencher(
          mensagens[modelo.chave],
          Object.fromEntries(
            modelo.campos.map((campo, indice) => [campo, achou[indice + 1]]),
          ),
        );
    }
    return texto;
  };
}
