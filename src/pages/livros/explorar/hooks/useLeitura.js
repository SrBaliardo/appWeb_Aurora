import { useEffect, useState } from "react";

export function useLeitura(livro, limitarPagina) {
  const [aberto, setAberto] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [tentativa, setTentativa] = useState(0);
  const [estado, setEstado] = useState({ fonte: "", status: "" });
  const fonte = livro.paginas[pagina - 1];
  const chave = `${fonte}-${tentativa}`;
  const status = estado.fonte === chave ? estado.status : "carregando";

  function mudarPagina(numero) {
    setPagina(limitarPagina(numero, livro.paginas.length));
    setZoom(100);
  }

  useEffect(() => {
    if (!aberto || status !== "pronto") return;
    const proxima = livro.paginas[pagina];
    if (proxima) {
      const imagem = new Image();
      imagem.src = proxima;
    }
  }, [aberto, pagina, livro, status]);

  useEffect(() => {
    if (!aberto || status !== "carregando") return undefined;
    const timer = window.setTimeout(
      () => setEstado({ fonte: chave, status: "erro" }),
      20000,
    );
    return () => window.clearTimeout(timer);
  }, [aberto, chave, status]);

  return {
    aberto,
    abrir: () => setAberto(true),
    fechar: () => setAberto(false),
    pagina,
    mudarPagina,
    zoom,
    alternarZoom: () =>
      setZoom((atual) => (atual === 100 ? 150 : atual === 150 ? 200 : 100)),
    fonte,
    chave,
    status,
    carregou: () => setEstado({ fonte: chave, status: "pronto" }),
    falhou: () => setEstado({ fonte: chave, status: "erro" }),
    tentar: () => setTentativa((atual) => atual + 1),
  };
}
