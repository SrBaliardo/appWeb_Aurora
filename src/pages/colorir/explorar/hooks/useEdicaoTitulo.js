import { useCallback, useEffect, useRef, useState } from "react";

export function useEdicaoTitulo(titulo, renomear, guardar, limite) {
  const [editando, setEditando] = useState(false),
    [rascunho, setRascunho] = useState("");
  const [invalido, setInvalido] = useState(false);
  const [largura, setLargura] = useState(215);
  const lapis = useRef(null),
    campo = useRef(null),
    contexto = useRef(null),
    devolverFoco = useRef(false);
  const medir = useCallback((texto, elemento = campo.current) => {
    if (!elemento) return 215;
    const estilo = window.getComputedStyle(elemento);
    contexto.current ||= document.createElement("canvas").getContext("2d");
    contexto.current.font = `${estilo.fontWeight} ${estilo.fontSize} ${estilo.fontFamily}`;
    return Math.ceil(contexto.current.measureText(texto).width);
  }, []);

  useEffect(() => {
    if (!editando) return undefined;
    const ajustar = () =>
      setLargura(Math.min(450, Math.max(215, medir(rascunho))));
    ajustar();
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, [editando, rascunho, medir]);

  useEffect(() => {
    if (!editando && devolverFoco.current) {
      lapis.current?.focus();
      devolverFoco.current = false;
    }
  }, [editando]);

  function editar() {
    setRascunho(titulo.slice(0, limite));
    setInvalido(false);
    devolverFoco.current = true;
    setEditando(true);
  }

  function alterar(evento) {
    const proximo = evento.target.value.slice(0, limite);
    const medida = medir(proximo, evento.currentTarget);
    if (medida > 450 && medida >= medir(rascunho, evento.currentTarget)) return;
    setRascunho(proximo);
    setInvalido(false);
  }

  function cancelar() {
    setEditando(false);
    setInvalido(false);
  }

  function confirmar(evento) {
    evento.preventDefault();
    if (!renomear(rascunho)) {
      setInvalido(true);
      return;
    }
    setEditando(false);
    guardar(true);
  }

  function teclado(evento) {
    if (evento.key === "Escape") {
      evento.preventDefault();
      evento.stopPropagation();
      cancelar();
    }
  }

  return {
    lapis,
    campo,
    largura,
    editando,
    rascunho,
    alterar,
    invalido,
    editar,
    cancelar,
    confirmar,
    teclado,
  };
}
