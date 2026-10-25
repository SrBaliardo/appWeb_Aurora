import { useInterface } from "../../contexts/interface/index.js";
import * as S from "./styles";

export default function Feedback({ feedback }) {
  const { t } = useInterface();

  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      <S.Mensagem key={feedback.chave} $tipo={feedback.tipo}>
        <S.Simbolo aria-hidden="true" $festa={feedback.tipo === "festa"}>
          {feedback.tipo === "festa"
            ? "🎉"
            : feedback.tipo === "acerto"
              ? "✨"
              : feedback.tipo === "erro"
                ? "🌱"
                : "💭"}
        </S.Simbolo>

        <span>{t(feedback.texto)}</span>
      </S.Mensagem>
    </div>
  );
}
