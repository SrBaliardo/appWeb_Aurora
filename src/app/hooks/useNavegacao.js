import { useCallback, useEffect, useRef, useState } from "react";
import { useInterface } from "../../contexts/interface/index.js";

const titulos = {
  colorir: "Um bosque para colorir",
  sequencias: "Sequências da Aurora",
  contagem: "Quantos há no bosque?",
  classificacao: "Cada coisa em seu lugar",
  iniciais: "Qual é a primeira letrinha?",
  historias: "A história embaralhada",
  quebracabeca: "Pedacinhos de aventura",
  livros: "Uma coleção de aventuras",
  inicio: "Aprender é uma aventura",
  forca: "Forca do bosque",
  palavras: "Cadê a letrinha?",
  memoria: "Amigos da memória",
  cores: "Um mundo de cores",
  descobertas: "O que é isso?",
  matematica: "Continhas da turma",
  escrita: "Vejo e escrevo",
};

function lerPagina() {
  const rota = window.location.hash.replace(/^#\/?/, "");
  return Object.hasOwn(titulos, rota) ? rota : "inicio";
}

export function useNavegacao() {
  const { t } = useInterface();
  const [pagina, setPagina] = useState(lerPagina);
  const iniciou = useRef(false);
  const antesDeNavegar = useRef(null);
  const registrarAntesDeNavegar = useCallback((acao) => {
    antesDeNavegar.current = acao;
  }, []);

  function interceptarNavegacao(evento) {
    if (
      !antesDeNavegar.current ||
      evento.defaultPrevented ||
      evento.button !== 0 ||
      evento.ctrlKey ||
      evento.metaKey ||
      evento.shiftKey ||
      evento.altKey
    )
      return;
    const link = evento.target.closest?.('a[href^="#/"]');
    const destino = link?.getAttribute("href");

    if (
      !destino ||
      destino === window.location.hash ||
      link.target === "_blank"
    )
      return;
    evento.preventDefault();
    antesDeNavegar.current(() => {
      window.location.hash = destino;
    });
  }

  useEffect(() => {
    const mudou = () => setPagina(lerPagina());
    window.addEventListener("hashchange", mudou);
    return () => window.removeEventListener("hashchange", mudou);
  }, []);

  useEffect(() => {
    document.title = `${t(titulos[pagina])} • Aventuras da Aurora`;
  }, [pagina, t]);

  useEffect(() => {
    if (!iniciou.current) {
      iniciou.current = true;
      return undefined;
    }
    const quadro = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(quadro);
  }, [pagina]);

  function pularConteudo(event) {
    event.preventDefault();
    document.getElementById("conteudo")?.focus();
  }

  return {
    pagina,
    pularConteudo,
    registrarAntesDeNavegar,
    interceptarNavegacao,
  };
}
