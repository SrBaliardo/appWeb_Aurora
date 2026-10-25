import { createPortal } from "react-dom";
import { useInterface } from "../../contexts/interface/index.js";
import { useRolagensBosque } from "../../hooks/useRolagensBosque.js";
import TrilhoBosque from "../TrilhoBosque/index.jsx";
import * as S from "./styles";

export default function RolagensBosque() {
  const { t, carregando } = useInterface();
  const { barras, mover } = useRolagensBosque();
  if (carregando) return null;

  function teclado(evento, alvo) {
    if (evento.key !== "Escape") return;
    const modal = alvo.closest(".MuiModal-root");
    if (!modal) return;

    evento.stopPropagation();
    modal.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  return barras.map((barra) =>
    createPortal(
      <S.Posicao
        data-controles-rolagem=""
        onKeyDown={(evento) => teclado(evento, barra.alvo)}
        $top={barra.top}
        $left={barra.left}
        $vertical={barra.vertical}
        $comprimento={barra.comprimento}
      >
        <TrilhoBosque
          {...barra}
          mover={(evento) =>
            mover(barra.alvo, barra.vertical, evento.currentTarget.value)
          }
          rotulo={
            t(barra.vertical ? "Rolagem vertical" : "Rolagem horizontal") +
            (barra.rotulo ? `: ${barra.rotulo}` : "")
          }
          descricao={t("Arraste a joaninha para rolar")}
          valorAcessivel={t("Posição da rolagem: {valor}%", {
            valor: Math.round(barra.progresso * 100),
          })}
          controleId={barra.alvo.id || undefined}
        />
      </S.Posicao>,
      barra.portal,
      barra.id,
    ),
  );
}
