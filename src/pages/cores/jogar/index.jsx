import { useInterface } from "../../../contexts/interface/index.js";
import AvancoRodada from "../../../components/AvancoRodada/index.jsx";
import BotaoReiniciar from "../../../components/BotaoReiniciar/index.jsx";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import Feedback from "../../../components/Feedback/index.jsx";
import OpcoesResposta from "../../../components/OpcoesResposta/index.jsx";
import QuadroFigura from "../../../components/QuadroFigura/index.jsx";
import Forma from "../../../components/FiguraGeometrica/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import * as S from "./styles";

export default function Cores({
  nivel,
  alterarNivel,
  idioma = "pt-BR",
  alterarIdioma,
}) {
  const { t } = useInterface();
  const partida = usePartida(nivel, idioma);

  return (
    <MolduraJogo
      idioma={idioma}
      alterarIdioma={alterarIdioma}
      nivel={nivel}
      alterarNivel={alterarNivel}
      titulo={t("Um mundo de cores")}
      descricao={t("Cada cor é uma descoberta. Qual você está vendo?")}
      emoji="🎨"
      fundo="#fce8d1"
    >
      <S.Centro>
        <S.Pergunta>{t("Qual é a cor da figura?")}</S.Pergunta>

        <S.Contador>
          {t("Descobertas coloridas:")} <strong>{partida.acertos}</strong>
        </S.Contador>

        <AvancoRodada
          key={partida.rodada.cor.id}
          venceu={partida.venceu}
          reiniciar={partida.reiniciar}
        >
          <QuadroFigura
            tamanho={210}
            fundo="#fff2ca"
            borda="#f0d48b"
            angulo={-3}
            efeito={partida.venceu ? "comemorar" : "nenhum"}
          >
            <Forma forma={partida.rodada.forma} cor={partida.rodada.cor.hex} />
          </QuadroFigura>
        </AvancoRodada>

        <OpcoesResposta
          idioma={idioma}
          opcoes={partida.opcoes}
          venceu={partida.venceu}
          escolher={partida.escolher}
          descricao={t("Escolha o nome da cor")}
        />

        <Feedback feedback={partida.feedback} />

        {!partida.venceu && (
          <S.Rodape>
            <BotaoReiniciar onClick={partida.reiniciar}>
              {t("Trocar figura")}
            </BotaoReiniciar>
          </S.Rodape>
        )}
      </S.Centro>
    </MolduraJogo>
  );
}
