import { useInterface } from "../../contexts/interface/index.js";
import FiguraGeometrica from "../FiguraGeometrica/index.jsx";
import * as S from "./styles";

export default function FiguraConteudo({
  figura,
  descricao = "Figura para descobrir",
}) {
  const { t } = useInterface();

  if (typeof figura === "string")
    return (
      <S.Figura role="img" aria-label={t(descricao)}>
        {figura}
      </S.Figura>
    );

  if (figura.tipo === "retrato")
    return (
      <S.Figura>
        <svg
          viewBox={figura.recorte}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={t(descricao)}
        >
          <image href={figura.src} width="1536" height="1024" />
        </svg>
      </S.Figura>
    );

  if (figura.tipo === "forma")
    return (
      <S.Figura>
        <FiguraGeometrica forma={figura.forma} descricao={t(descricao)} />
      </S.Figura>
    );

  return (
    <S.Figura>
      <S.Numero
        $digitos={String(figura.valor).length}
        role="img"
        aria-label={t(`Número ${figura.valor}`)}
      >
        {figura.valor}
      </S.Numero>
    </S.Figura>
  );
}
