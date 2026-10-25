import { useEffect, useState } from "react";

export function useCarrossel() {
  const [destaque, setDestaque] = useState(0);
  const [mouseSobre, setMouseSobre] = useState(false);
  const [focoDentro, setFocoDentro] = useState(false);
  const pausado = mouseSobre || focoDentro;

  useEffect(() => {
    if (pausado) return undefined;
    const timer = window.setTimeout(
      () => setDestaque((atual) => (atual + 1) % 3),
      5000,
    );
    return () => window.clearTimeout(timer);
  }, [destaque, pausado]);

  return {
    destaque,
    setDestaque,
    pausado,
    aoEntrarMouse: () => setMouseSobre(true),
    aoSairMouse: () => setMouseSobre(false),
    aoFocar: () => setFocoDentro(true),
    aoDesfocar: (evento) => {
      if (!evento.currentTarget.contains(evento.relatedTarget))
        setFocoDentro(false);
    },
  };
}
