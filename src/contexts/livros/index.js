import { LIVROS } from "./constantes.js";
import { construirCatalogo } from "./builders/catalogo.js";
import { limitarPagina } from "./regras.js";

const catalogos = Object.fromEntries(
  ["pt-BR", "en-US", "es-ES"].map((idioma) => [
    idioma,
    construirCatalogo(LIVROS, idioma),
  ]),
);

export function useLivros(idioma = "pt-BR") {
  const livros = catalogos[idioma] || catalogos["pt-BR"];
  return {
    livros,
    livroGratuito: livros.find((livro) => livro.gratuito),
    limitarPagina,
  };
}
