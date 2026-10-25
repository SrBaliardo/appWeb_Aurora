import { useEffect, useRef } from "react";
import * as S from "./styles";

const legendas = {
  "pt-BR": "Carregando…",
  "en-US": "Loading…",
  "es-ES": "Cargando…",
};

export default function Carregamento({ idioma = "pt-BR", local = false }) {
  const painel = useRef(null);

  useEffect(() => {
    if (local) return undefined;
    const anterior = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const bloquearTeclado = (evento) => {
      if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
      evento.preventDefault();
      evento.stopPropagation();
    };

    document.addEventListener("keydown", bloquearTeclado, true);
    painel.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", bloquearTeclado, true);
      document.body.style.overflow = overflow;
      if (anterior?.isConnected) anterior.focus({ preventScroll: true });
    };
  }, [local]);

  return (
    <S.Overlay
      $local={local}
      lang={idioma}
      role="status"
      aria-live="polite"
      aria-busy="true"
      tabIndex={-1}
      ref={painel}
    >
      <S.Flor viewBox="0 0 120 140" width="92" height="108" aria-hidden="true">
        <path
          d="M60 66v65M60 107q-23-24-29-7 4 15 29 14m0-20q23-24 29-7-4 15-29 14"
          fill="#84bf55"
          stroke="#4b9147"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {Array.from({ length: 8 }, (_, ordem) => (
          <S.Petala key={ordem} $ordem={ordem}>
            <ellipse
              cx="60"
              cy="31"
              rx="11"
              ry="22"
              transform={`rotate(${ordem * 45} 60 59)`}
              fill={ordem % 2 ? "#fff6c9" : "#fffdf0"}
              stroke="#eed88a"
              strokeWidth="1.3"
            />
          </S.Petala>
        ))}

        <circle
          cx="60"
          cy="59"
          r="17"
          fill="#ffcc4b"
          stroke="#ecb43a"
          strokeWidth="2"
        />
        <circle cx="55" cy="57" r="1.5" fill="#87552d" />
        <circle cx="65" cy="57" r="1.5" fill="#87552d" />
        <path
          d="M55 64q5 5 10 0"
          fill="none"
          stroke="#87552d"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </S.Flor>

      <S.Legenda>{legendas[idioma] || legendas["pt-BR"]}</S.Legenda>
    </S.Overlay>
  );
}
