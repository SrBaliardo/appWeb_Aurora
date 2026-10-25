import * as S from "./styles";

export default function FiguraArrastada({
  arrasto,
  children,
  usarDimensoes = false,
}) {
  return arrasto ? (
    <S.Fantasma
      $arrasto={arrasto}
      $usarDimensoes={usarDimensoes}
      aria-hidden="true"
    >
      {children}
    </S.Fantasma>
  ) : null;
}
