import { useInterface } from "../../../../../contexts/interface/index.js";
import { useArraste } from "../../hooks/useArraste.js";
import Peca from "../Peca/index.jsx";
import Tabuleiro from "../Tabuleiro/index.jsx";
import * as S from "./styles";

export default function Montagem({ partida }) {
  const { t } = useInterface();
  const arraste = useArraste(partida);
  const { rodada, imagem, encaixadas, selecionada, etapa } = partida;
  const fantasma = rodada.pecas.find((peca) => peca.id === arraste.arrasto?.id);

  function bandeja(lado) {
    return (
      <S.Bandeja
        $lado={lado}
        $compacta={rodada.lado === 4}
        role="group"
        aria-label={t(
          lado === "esquerda" ? "Peças da esquerda" : "Peças da direita",
        )}
      >
        {etapa === "montar" &&
          rodada.pecas
            .filter(
              (_peca, indice) => indice % 2 === (lado === "esquerda" ? 0 : 1),
            )
            .map((peca, indice) => (
              <S.EspacoPeca key={peca.id}>
                {!encaixadas.includes(peca.id) && (
                  <S.Peca
                    type="button"
                    $selecionada={selecionada === peca.id}
                    $arrastando={arraste.arrasto?.id === peca.id}
                    aria-pressed={selecionada === peca.id}
                    aria-label={t(
                      "Peça {numero}. Arraste ou selecione e escolha um espaço.",
                      { numero: peca.posicao + 1 },
                    )}
                    onPointerDown={(evento) => arraste.iniciar(evento, peca.id)}
                    onPointerMove={arraste.mover}
                    onPointerUp={arraste.terminar}
                    onPointerCancel={arraste.cancelar}
                    onLostPointerCapture={arraste.cancelar}
                    onClick={(evento) => arraste.clicar(peca.id, evento)}
                    $angulo={[-5, 4, -3, 5, 0][indice % 5]}
                  >
                    <Peca peca={peca} imagem={imagem} lado={rodada.lado} />
                  </S.Peca>
                )}
              </S.EspacoPeca>
            ))}
      </S.Bandeja>
    );
  }

  return (
    <S.Mesa $compacta={rodada.lado === 4}>
      {bandeja("esquerda")}
      <Tabuleiro partida={partida} arrasto={arraste.arrasto} />
      {bandeja("direita")}
      {fantasma && (
        <S.Fantasma
          $x={arraste.arrasto.x}
          $y={arraste.arrasto.y}
          $voltando={arraste.arrasto.voltando}
          aria-hidden="true"
        >
          <Peca peca={fantasma} imagem={imagem} lado={rodada.lado} />
        </S.Fantasma>
      )}
    </S.Mesa>
  );
}
