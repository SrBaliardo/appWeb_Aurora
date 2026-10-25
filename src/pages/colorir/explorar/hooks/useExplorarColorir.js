import { useEffect, useRef, useState } from "react";

export function useExplorarColorir(aoAlterarPintura) {
  const [tela, setTela] = useState("colecao"),
    [pagina, setPagina] = useState(null);
  const iniciou = useRef(false);

  useEffect(() => {
    aoAlterarPintura?.(tela === "pintura");
    return () => aoAlterarPintura?.(false);
  }, [tela, aoAlterarPintura]);

  useEffect(() => {
    if (!iniciou.current) {
      iniciou.current = true;
      return undefined;
    }
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [tela]);

  return {
    tela,
    pagina,
    abrirLivro: () => setTela("galeria"),
    escolher: (desenho) => {
      setPagina(desenho);
      setTela("pintura");
    },
    voltarColecao: () => setTela("colecao"),
    voltarGaleria: () => setTela("galeria"),
  };
}
