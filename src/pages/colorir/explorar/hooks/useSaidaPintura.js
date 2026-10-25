import { useCallback, useEffect, useRef, useState } from "react";

export function useSaidaPintura(
  guardar,
  voltar,
  ocupado,
  descartarAoSair,
  registrarAntesDeNavegar,
) {
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const pendente = useRef(false),
    ativo = useRef(true);
  const destino = useRef(null);

  useEffect(() => {
    ativo.current = true;
    return () => {
      ativo.current = false;
    };
  }, []);

  const navegar = useCallback(
    async (continuar) => {
      if (ocupado || pendente.current) return;
      if (continuar) destino.current = continuar;
      pendente.current = true;
      setSalvando(true);
      let salvo = false;
      try {
        salvo = await guardar(true);
      } catch {
        /* A confirmação também permite recuperar uma falha inesperada. */
      } finally {
        pendente.current = false;
        if (ativo.current) setSalvando(false);
      }
      if (!ativo.current) return;
      if (salvo) (destino.current || voltar)();
      else setConfirmarSaida(true);
    },
    [ocupado, guardar, voltar],
  );

  useEffect(() => {
    registrarAntesDeNavegar?.(navegar);
    return () => registrarAntesDeNavegar?.(null);
  }, [registrarAntesDeNavegar, navegar]);

  return {
    sair: () => navegar(),
    salvando,
    confirmarSaida,
    cancelarSaida: () => {
      if (!pendente.current) {
        destino.current = null;
        setConfirmarSaida(false);
      }
    },
    sairSemSalvar: () => {
      if (!pendente.current && !ocupado) {
        descartarAoSair();
        (destino.current || voltar)();
      }
    },
  };
}
