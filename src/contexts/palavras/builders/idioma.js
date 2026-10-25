import { TRADUCOES } from "../traducoes.js";

export function traduzirNome(id, original, idioma = "pt-BR") {
  const indice = idioma === "en-US" ? 0 : idioma === "es-ES" ? 1 : -1;
  return indice < 0 ? original : TRADUCOES[id]?.[indice] || original;
}

export function traduzirPalavra(palavra, idioma = "pt-BR") {
  const texto = traduzirNome(palavra.id, palavra.texto, idioma);
  const dicas = [...palavra.dicas];
  if (idioma !== "pt-BR") {
    const letras = [...texto].filter((letra) => /\p{L}/u.test(letra));
    if (["pera", "maca", "bala", "rio", "amora"].includes(palavra.id))
      dicas[2] = `Neste idioma, meu nome tem ${letras.length} letras e começa com ${letras[0]}.`;
    if (palavra.id === "manga")
      dicas[2] = "Minha polpa pode virar suco ou sorvete.";
    if (palavra.id === "foca")
      dicas[2] = "Posso descansar em rochas perto do mar.";
  }
  return { ...palavra, texto, dicas, idioma };
}
