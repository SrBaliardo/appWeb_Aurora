export function embaralhar(itens, random = Math.random) {
  const resultado = [...itens];
  for (let i = resultado.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

export function sortearSemRepetir(itens, anterior, random = Math.random) {
  const alternativas = itens.filter((item) => item.id !== anterior);
  const candidatos = alternativas.length ? alternativas : itens;
  return candidatos[Math.floor(random() * candidatos.length)];
}
