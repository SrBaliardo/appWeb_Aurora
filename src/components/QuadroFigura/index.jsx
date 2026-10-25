import * as S from "./styles";

export default function QuadroFigura({
  children,
  tamanho = 150,
  fundo = "#dcf4b6",
  borda = "#badb8c",
  angulo = -4,
  efeito = "nenhum",
  tracejada = false,
  decorativo = false,
}) {
  return (
    <S.Moldura
      $tamanho={tamanho}
      $fundo={fundo}
      $borda={borda}
      $angulo={angulo}
      $tracejada={tracejada}
      aria-hidden={decorativo || undefined}
    >
      <S.Conteudo $angulo={angulo}>
        <S.Animacao $efeito={efeito}>{children}</S.Animacao>
      </S.Conteudo>
    </S.Moldura>
  );
}
