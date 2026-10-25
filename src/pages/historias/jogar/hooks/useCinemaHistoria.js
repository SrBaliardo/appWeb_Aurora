import { useState } from "react";

export function useCinemaHistoria(quantidade) {
  const [aberto, setAberto] = useState(false);
  const [indice, setIndice] = useState(0);

  return {
    aberto,
    indice,
    abrir: () => {
      setIndice(0);
      setAberto(true);
    },
    fechar: () => setAberto(false),
    anterior: () => setIndice((atual) => Math.max(0, atual - 1)),
    proxima: () => setIndice((atual) => Math.min(quantidade - 1, atual + 1)),
  };
}
