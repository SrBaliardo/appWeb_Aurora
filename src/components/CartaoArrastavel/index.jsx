import * as S from "./styles";

export default function CartaoArrastavel({
  id,
  figura,
  legenda,
  descricao,
  selecionado,
  gestos,
}) {
  return (
    <S.Cartao
      type="button"
      $selecionado={selecionado}
      $arrastando={gestos.arrasto?.id === id}
      aria-pressed={selecionado}
      aria-label={descricao}
      onPointerDown={(evento) => gestos.iniciar(evento, id)}
      onPointerMove={gestos.mover}
      onPointerUp={gestos.terminar}
      onPointerCancel={gestos.cancelar}
      onLostPointerCapture={gestos.cancelar}
      onClick={(evento) => gestos.clicar(id, evento)}
    >
      <S.Figura aria-hidden="true">{figura}</S.Figura>

      <S.Legenda>{legenda}</S.Legenda>
    </S.Cartao>
  );
}
