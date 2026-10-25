import { useEffect, useRef, useState } from "react";

export function useRolagemMenu(idioma) {
  const menu = useRef(null),
    itens = useRef(null);
  const atualizar = useRef(() => {});
  const [estado, setEstado] = useState({
    visivel: false,
    progresso: 0,
    direcao: 1,
    andando: false,
  });

  useEffect(() => {
    const elemento = menu.current,
      conteudo = itens.current;

    if (!elemento || !conteudo) return undefined;

    let quadro = null,
      pausa = null,
      anterior = elemento.scrollLeft;

    function medir(parar = false) {
      const limite = Math.max(0, elemento.scrollWidth - elemento.clientWidth);
      const posicao = Math.max(0, Math.min(limite, elemento.scrollLeft));
      const moveu = limite > 1 && Math.abs(posicao - anterior) > 0.1;
      const direcao = posicao >= anterior ? 1 : -1;
      anterior = posicao;
      const progresso = limite > 1 ? posicao / limite : 0;

      setEstado((atual) => {
        const proximo = {
          visivel: limite > 1,
          progresso,
          direcao: moveu ? direcao : atual.direcao,
          andando: limite > 1 && !parar && (moveu || atual.andando),
        };
        return Object.keys(proximo).every(
          (chave) => proximo[chave] === atual[chave],
        )
          ? atual
          : proximo;
      });

      if (moveu) {
        window.clearTimeout(pausa);
        pausa = window.setTimeout(() => {
          pausa = null;
          setEstado((atual) =>
            atual.andando ? { ...atual, andando: false } : atual,
          );
        }, 150);
      }
    }

    function agendar() {
      if (quadro === null)
        quadro = window.requestAnimationFrame(() => {
          quadro = null;
          medir();
        });
    }
    atualizar.current = medir;
    medir(true);

    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(agendar) : null;
    observer?.observe(elemento);
    observer?.observe(conteudo);
    elemento.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);

    return () => {
      atualizar.current = () => {};
      observer?.disconnect();
      elemento.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      if (quadro !== null) window.cancelAnimationFrame(quadro);
      window.clearTimeout(pausa);
    };
  }, [idioma]);

  function mover(evento) {
    const elemento = menu.current,
      valor = Number(evento.currentTarget.value);

    if (!elemento || !Number.isFinite(valor)) return;
    elemento.scrollLeft =
      (Math.max(0, elemento.scrollWidth - elemento.clientWidth) *
        Math.max(0, Math.min(100, valor))) /
      100;

    atualizar.current();
  }

  return { menu, itens, ...estado, mover };
}
