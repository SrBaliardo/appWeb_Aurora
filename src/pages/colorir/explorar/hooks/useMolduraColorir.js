import { useEffect, useState } from "react";

export function useMolduraColorir(ampliado) {
  const [elemento, setElemento] = useState(null);
  const [largura, setLargura] = useState(0);

  useEffect(() => {
    if (!elemento) return undefined;
    const medir = () => {
      const rect = elemento.getBoundingClientRect();
      const disponivel = Math.max(
        0,
        Math.min(rect.width - 16, (rect.height - 16) * 1.5),
      );
      setLargura(ampliado ? disponivel : Math.min(960, disponivel * 0.92));
    };
    medir();
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(medir) : null;
    observer?.observe(elemento);
    window.addEventListener("resize", medir);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, [ampliado, elemento]);

  return { palco: setElemento, largura };
}
