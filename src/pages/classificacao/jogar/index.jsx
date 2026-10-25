import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import AvancoRodada from "../../../components/AvancoRodada/index.jsx";
import Feedback from "../../../components/Feedback/index.jsx";
import BotaoReiniciar from "../../../components/BotaoReiniciar/index.jsx";
import Colecoes from "./components/Colecoes/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import * as S from "./styles";

export default function Classificacao({ nivel = "facil", alterarNivel }) {
  const { t } = useInterface();
  const partida = usePartida(nivel);

  return (
    <MolduraJogo
      titulo={t("Cada coisa em seu lugar")}
      descricao={t("Descubra o que as figuras têm em comum.")}
      emoji="🧺"
      fundo="#fbe3ab"
      nivel={nivel}
      alterarNivel={alterarNivel}
    >
      <S.Instrucao>
        {t(
          "Arraste uma figura até o grupo. Ou selecione a figura e depois o grupo.",
        )}
      </S.Instrucao>

      <AvancoRodada
        key={partida.geracao}
        largo
        venceu={partida.venceu}
        reiniciar={partida.reiniciar}
      >
        <Colecoes key={partida.geracao} partida={partida} />
      </AvancoRodada>

      <S.Contador>
        {t("{feitas} de {total} figuras organizadas", {
          feitas: partida.organizados.length,
          total: partida.rodada.itens.length,
        })}
      </S.Contador>

      <Feedback feedback={partida.feedback} />

      {!partida.venceu && (
        <S.Rodape>
          <BotaoReiniciar onClick={partida.reiniciar}>
            {t("Trocar desafio")}
          </BotaoReiniciar>
        </S.Rodape>
      )}
    </MolduraJogo>
  );
}
