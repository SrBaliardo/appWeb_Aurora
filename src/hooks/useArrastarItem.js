import { useEffect, useRef, useState } from "react";

function destinoNoPonto(x, y) {
  return (
    document
      .elementFromPoint(x, y)
      ?.closest("[data-destino]")
      ?.getAttribute("data-destino") ?? null
  );
}

export function useArrastarItem({ aoSoltar, aoSelecionar }) {
  const [arrasto, setArrasto] = useState(null);
  const ativo = useRef(null);
  const suprimirClique = useRef(false);
  const quadroRolagem = useRef(null);

  useEffect(
    () => () => {
      if (quadroRolagem.current !== null)
        window.cancelAnimationFrame(quadroRolagem.current);
    },
    [],
  );

  function pararRolagem() {
    if (quadroRolagem.current !== null)
      window.cancelAnimationFrame(quadroRolagem.current);
    quadroRolagem.current = null;
  }

  function rolarNaBorda() {
    quadroRolagem.current = null;
    const atual = ativo.current;
    if (!atual?.moveu) return;
    const passo =
      atual.ultimoY < 60
        ? -12
        : atual.ultimoY > window.innerHeight - 60
          ? 12
          : 0;
    if (!passo) return;
    const antes = window.scrollY;
    window.scrollBy({ top: passo, left: 0, behavior: "instant" });
    if (window.scrollY === antes) return;
    const destino = destinoNoPonto(atual.ultimoX, atual.ultimoY);
    setArrasto((estado) => (estado ? { ...estado, destino } : estado));
    quadroRolagem.current = window.requestAnimationFrame(rolarNaBorda);
  }

  function iniciar(evento, id) {
    if (evento.button !== 0 || evento.isPrimary === false) return;
    suprimirClique.current = false;
    const caixa = evento.currentTarget.getBoundingClientRect?.();
    ativo.current = {
      id,
      ponteiro: evento.pointerId,
      x: evento.clientX,
      y: evento.clientY,
      moveu: false,
      largura: caixa?.width,
      altura: caixa?.height,
      offsetX: caixa ? evento.clientX - caixa.left : 36,
      offsetY: caixa ? evento.clientY - caixa.top : 36,
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function mover(evento) {
    const atual = ativo.current;
    if (!atual || atual.ponteiro !== evento.pointerId) return;
    if (
      !atual.moveu &&
      Math.hypot(evento.clientX - atual.x, evento.clientY - atual.y) < 6
    )
      return;
    atual.moveu = true;
    evento.preventDefault();
    atual.ultimoX = evento.clientX;
    atual.ultimoY = evento.clientY;
    setArrasto({
      id: atual.id,
      x: evento.clientX,
      y: evento.clientY,
      destino: destinoNoPonto(evento.clientX, evento.clientY),
      largura: atual.largura,
      altura: atual.altura,
      offsetX: atual.offsetX,
      offsetY: atual.offsetY,
    });
    if (
      quadroRolagem.current === null &&
      Number.isFinite(window.innerHeight) &&
      typeof window.requestAnimationFrame === "function"
    )
      quadroRolagem.current = window.requestAnimationFrame(rolarNaBorda);
  }

  function terminar(evento) {
    const atual = ativo.current;
    if (!atual || atual.ponteiro !== evento.pointerId) return;
    pararRolagem();
    ativo.current = null;
    if (!atual.moveu) return;
    suprimirClique.current = true;
    const destino = destinoNoPonto(evento.clientX, evento.clientY);
    setArrasto(null);
    if (destino !== null) aoSoltar(atual.id, destino);
  }

  function cancelar() {
    if (!ativo.current) return;
    pararRolagem();
    ativo.current = null;
    setArrasto(null);
  }

  function clicar(id, evento, acao = aoSelecionar) {
    if (suprimirClique.current && evento.detail !== 0) {
      suprimirClique.current = false;
      return;
    }
    acao(id);
  }
  return { arrasto, iniciar, mover, terminar, cancelar, clicar };
}
