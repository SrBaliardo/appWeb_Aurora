import { LIVROS_COLORIR } from "../constantes.js";
import { EDICOES } from "../edicoes.js";

export function construirCatalogo(idioma = "pt-BR") {
  const edicoes = EDICOES[idioma];
  const prefixo = edicoes ? `/colorir/${idioma}` : "/colorir";
  return LIVROS_COLORIR.map((livro) => {
    const edicao = edicoes?.[livro.id];
    return {
      ...livro,
      titulo: edicao?.titulo || livro.titulo,
      idioma: edicao?.idioma || "pt-BR",
      capa: `${prefixo}/capas/${livro.id}.png`,
      download: livro.gratuito
        ? `${prefixo}/bosque/${edicao?.arquivo || "Aurora-Goodies-Bosque.pdf"}`
        : null,
      tamanhoAproximadoMB: livro.gratuito
        ? edicao
          ? Math.round(edicao.bytes / 1048576)
          : 42
        : null,
      paginas: Array.from({ length: livro.desenhos || 0 }, (_, i) => {
        const arquivo = `pagina-${String(i + 1).padStart(2, "0")}`;

        return {
          id: `${livro.id}-${i + 1}`,
          numero: i + 1,
          imagem: `/colorir/${livro.id}/${arquivo}.png`,
          miniatura: `/colorir/${livro.id}/${arquivo}-mini.png`,
          mascara: `/colorir/${livro.id}/${arquivo}-v2-regioes.png`,
          cobertura: `/colorir/${livro.id}/${arquivo}-v2-cobertura.png`,
          mascaraLegada: `/colorir/${livro.id}/${arquivo}-regioes.png`,
        };
      }),
    };
  });
}
