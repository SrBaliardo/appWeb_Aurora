import { useEffect, useRef, useState } from "react";

function destinoNoPonto(x, y) {
  const alvo = document.elementFromPoint(x, y)?.closest("[data-encaixe]");
  return alvo ? Number(alvo.getAttribute("data-encaixe")) : null;
}

export function useArraste({ encaixar, avaliar, selecionar }) {
  const [arrasto, setArrasto] = useState(null);
  const ativo = useRef(null);
  const suprimirClique = useRef(false);
  const retorno = useRef(null);
  useEffect(() => () => window.clearTimeout(retorno.current), []);

  function iniciar(evento, id) {
    if (evento.button !== 0 || evento.isPrimary === false || arrasto?.voltando)
      return;
    suprimirClique.current = false;
    const retangulo = evento.currentTarget.getBoundingClientRect();
    ativo.current = {
      id,
      pointer: evento.pointerId,
      x: evento.clientX,
      y: evento.clientY,
      movendo: false,
      origemX: retangulo.left + retangulo.width / 2,
      origemY: retangulo.top + retangulo.height / 2,
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }
  function mover(evento) {
    const atual = ativo.current;
    if (!atual || evento.pointerId !== atual.pointer) return;
    if (
      !atual.movendo &&
      Math.hypot(evento.clientX - atual.x, evento.clientY - atual.y) < 6
    )
      return;
    atual.movendo = true;
    evento.preventDefault();
    setArrasto({
      id: atual.id,
      x: evento.clientX,
      y: evento.clientY,
      alvo: destinoNoPonto(evento.clientX, evento.clientY),
    });
  }
  function terminar(evento) {
    const atual = ativo.current;
    if (!atual || evento.pointerId !== atual.pointer) return;
    ativo.current = null;
    if (!atual.movendo) return;
    suprimirClique.current = true;
    const destino = destinoNoPonto(evento.clientX, evento.clientY);
    const resultado = destino === null ? "ignorar" : avaliar(atual.id, destino);
    if (destino !== null) encaixar(atual.id, destino);
    if (resultado === "acerto") {
      setArrasto(null);
      return;
    }
    setArrasto({
      id: atual.id,
      x: atual.origemX,
      y: atual.origemY,
      alvo: null,
      voltando: true,
    });
    retorno.current = window.setTimeout(() => setArrasto(null), 180);
  }
  function cancelar() {
    if (!ativo.current) return;
    ativo.current = null;
    setArrasto(null);
  }
  function clicar(id, evento) {
    if (suprimirClique.current && evento.detail !== 0) {
      suprimirClique.current = false;
      return;
    }
    selecionar(id);
  }
  return { arrasto, iniciar, mover, terminar, cancelar, clicar };
}
