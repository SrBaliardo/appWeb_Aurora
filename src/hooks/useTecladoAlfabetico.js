import { useEffect } from "react";

export function useTecladoAlfabetico(alfabeto, normalizar, escolher) {
  useEffect(() => {
    function teclado(event) {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.repeat ||
        /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) ||
        event.target.isContentEditable
      )
        return;
      if (event.key.length === 1 && alfabeto.includes(normalizar(event.key))) {
        event.preventDefault();
        escolher(event.key);
      }
    }
    window.addEventListener("keydown", teclado);
    return () => window.removeEventListener("keydown", teclado);
  }, [alfabeto, normalizar, escolher]);
}
