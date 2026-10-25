import { useInterface } from "../../contexts/interface/index.js";
import Feedback from "../Feedback/index.jsx";
import AvancoRodada from "../AvancoRodada/index.jsx";
import BotaoReiniciar from "../BotaoReiniciar/index.jsx";
import FiguraConteudo from "../FiguraConteudo/index.jsx";
import PainelDicas from "../PainelDicas/index.jsx";
import OpcoesResposta from "../OpcoesResposta/index.jsx";
import QuadroFigura from "../QuadroFigura/index.jsx";
import * as S from "./styles";

export default function PartidaOpcoes({
  partida,
  children,
  renderizarAcaoOpcao,
  avisoOpcoes,
}) {
  const { t } = useInterface();

  return (
    <S.Grade>
      <S.Centro>
        <S.Pergunta>{t(partida.rodada.pergunta)}</S.Pergunta>
        <S.Contador>
          {t("Descobertas:")} <strong>{partida.acertos}</strong>
        </S.Contador>

        <AvancoRodada
          key={partida.rodada.id}
          venceu={partida.venceu}
          reiniciar={partida.reiniciar}
        >
          {children || (
            <QuadroFigura
              tamanho={170}
              fundo="#f1e4ff"
              borda="#d6b4ef"
              angulo={3}
              efeito={partida.venceu ? "comemorar" : "nenhum"}
            >
              <FiguraConteudo figura={partida.rodada.figura} />
            </QuadroFigura>
          )}
        </AvancoRodada>

        <OpcoesResposta
          idioma={partida.idioma}
          opcoes={partida.opcoes}
          venceu={partida.venceu}
          escolher={partida.escolher}
          renderizarAcao={renderizarAcaoOpcao}
        />

        {avisoOpcoes !== undefined && (
          <S.AvisoOpcoes role="status">{t(avisoOpcoes)}</S.AvisoOpcoes>
        )}

        <Feedback feedback={partida.feedback} />
        {!partida.venceu && (
          <S.Rodape>
            <BotaoReiniciar onClick={partida.reiniciar}>
              {t("Trocar desafio")}
            </BotaoReiniciar>
          </S.Rodape>
        )}
      </S.Centro>

      <PainelDicas
        dicas={partida.dicas}
        esgotadas={partida.dicasEsgotadas}
        pedir={partida.pedirDica}
        encerrado={partida.venceu}
      />
    </S.Grade>
  );
}
