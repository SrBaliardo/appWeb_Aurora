import { useEffect, useState } from "react";

export function useAvancoAposSucesso(venceu) {
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    setPronto(false);
    if (!venceu) return undefined;
    const timer = window.setTimeout(() => setPronto(true), 1500);
    return () => window.clearTimeout(timer);
  }, [venceu]);
  return venceu && pronto;
}
