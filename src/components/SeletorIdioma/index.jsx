import { useInterface } from "../../contexts/interface/index.js";
import * as S from "./styles";

const idiomas = [
  ["pt-BR", "Português brasileiro", "Brasil"],
  ["en-US", "Inglês", "Estados Unidos"],
  ["es-ES", "Espanhol", "Espanha"],
];

function Bandeira({ idioma }) {
  return (
    <svg viewBox="0 0 36 24" width="36" height="24" aria-hidden="true">
      {idioma === "pt-BR" ? (
        <>
          <path fill="#169447" d="M0 0h36v24H0z" />
          <path fill="#ffdf45" d="m18 3 15 9-15 9L3 12Z" />
          <circle cx="18" cy="12" r="6" fill="#244b9b" />
          <path
            d="M12.5 10.5q6-1 11 3"
            fill="none"
            stroke="#fff"
            strokeWidth="1.3"
          />
        </>
      ) : idioma === "en-US" ? (
        <>
          <path fill="#fff" d="M0 0h36v24H0z" />
          {Array.from({ length: 7 }, (_, i) => (
            <rect
              key={i}
              y={(i * 24) / 6.5}
              width="36"
              height={24 / 13}
              fill="#c93c49"
            />
          ))}

          <path fill="#294776" d="M0 0h16v13H0z" />
          {Array.from({ length: 12 }, (_, i) => (
            <circle
              key={i}
              cx={2 + (i % 4) * 4}
              cy={2.5 + Math.floor(i / 4) * 4}
              r=".8"
              fill="#fff"
            />
          ))}
        </>
      ) : (
        <>
          <path fill="#bd2436" d="M0 0h36v24H0z" />
          <path fill="#ffda49" d="M0 6h36v12H0z" />
          <path fill="#bd2436" d="M9 9h5v5l-2.5 2L9 14z" />
          <path stroke="#fff" strokeWidth="1" d="M8 10v5m7-5v5m-4-6v5" />
        </>
      )}
    </svg>
  );
}

export default function SeletorIdioma({
  idioma = "pt-BR",
  alterar,
  compacto = false,
  desabilitado = false,
}) {
  const { t } = useInterface();

  return (
    <S.Barra $compacto={compacto}>
      {!compacto && <span>{t("Idioma das palavras:")}</span>}
      <S.Opcoes
        $compacto={compacto}
        role="group"
        aria-label={t(compacto ? "Idioma da página" : "Idioma das palavras")}
      >
        {idiomas.map(([id, nome, pais]) => (
          <S.Botao
            $compacto={compacto}
            key={id}
            type="button"
            disabled={desabilitado}
            $ativo={idioma === id}
            aria-pressed={idioma === id}
            aria-label={t(`${nome} (${pais})`)}
            title={t(`${nome} (${pais})`)}
            onClick={() => alterar(id)}
          >
            <Bandeira idioma={id} />
          </S.Botao>
        ))}
      </S.Opcoes>

      {!compacto && (
        <small>{t("Trocar o idioma começa uma nova rodada.")}</small>
      )}
    </S.Barra>
  );
}
