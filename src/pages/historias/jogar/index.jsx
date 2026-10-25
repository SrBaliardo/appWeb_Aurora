import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import AvancoRodada from "../../../components/AvancoRodada/index.jsx";
import Feedback from "../../../components/Feedback/index.jsx";
import BotaoReiniciar from "../../../components/BotaoReiniciar/index.jsx";
import LinhaTempo from "./components/LinhaTempo/index.jsx";
import AjudaHistoria from "./components/AjudaHistoria/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import * as S from "./styles";

export default function Historias({ nivel = "facil", alterarNivel }) {
  const { t } = useInterface();
  const partida = usePartida(nivel);

  return (
    <MolduraJogo
      titulo={t("A história embaralhada")}
      descricao={t("Organize as cenas e descubra o começo, o meio e o fim.")}
      emoji="📖"
      fundo="#e6d6fa"
      nivel={nivel}
      alterarNivel={alterarNivel}
    >
      <S.Titulo>{t(partida.rodada.titulo)}</S.Titulo>
      <S.Instrucao>
        {t(
          "Arraste ou selecione uma cena e escolha seu lugar. Arraste entre os espaços para trocar as cenas, ou clique para retirar.",
        )}
      </S.Instrucao>
      <AjudaHistoria key={`ajuda-${partida.geracao}`} rodada={partida.rodada} />
      <AvancoRodada
        key={`avanco-${partida.geracao}`}
        largo
        venceu={partida.venceu}
        reiniciar={partida.reiniciar}
      >
        <LinhaTempo key={`cenas-${partida.geracao}`} partida={partida} />
      </AvancoRodada>
      {!partida.venceu && (
        <S.Conferir
          variant="contained"
          disabled={!partida.preenchida}
          onClick={partida.conferir}
        >
          {t("Conferir história")}
        </S.Conferir>
      )}
      <Feedback feedback={partida.feedback} />
      {!partida.venceu && (
        <S.Rodape>
          <BotaoReiniciar onClick={partida.reiniciar}>
            {t("Trocar história")}
          </BotaoReiniciar>
        </S.Rodape>
      )}
    </MolduraJogo>
  );
}
