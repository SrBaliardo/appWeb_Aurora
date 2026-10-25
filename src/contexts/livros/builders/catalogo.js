import { EDICOES } from "../edicoes.js";

const legendas = {
  "pt-BR": "Histórias em português",
  "en-US": "Histórias em inglês",
  "es-ES": "Histórias em espanhol",
};

export function construirCatalogo(livros, idioma = "pt-BR") {
  const edicoes = EDICOES[idioma];
  const prefixo = edicoes ? `/books/${idioma}` : "/books";
  return livros.map((livro) => {
    const edicao = edicoes?.[livro.id];
    return {
      ...livro,
      titulo: edicao?.titulo || livro.titulo,
      idioma: edicao?.idioma || "pt-BR",
      legendaIdioma: edicoes ? legendas[idioma] : legendas["pt-BR"],
      capa: `${prefixo}/covers/${livro.id}.jpg`,
      download: livro.gratuito
        ? `${prefixo}/bosque/${edicao?.arquivo || "O-Bosque-Esta-Chamando.pdf"}`
        : null,
      tamanhoAproximadoMB: livro.gratuito
        ? edicao
          ? Math.round(edicao.bytes / 1048576)
          : 58
        : null,
      paginas: livro.gratuito
        ? Array.from(
            { length: edicao?.paginas || livro.paginas },
            (_, indice) =>
              `${prefixo}/${livro.id}/pagina-${String(indice + 1).padStart(3, "0")}.jpg`,
          )
        : [],
    };
  });
}
