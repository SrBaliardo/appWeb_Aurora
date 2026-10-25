import { useInterface } from "../../../contexts/interface/index.js";
import AvancoRodada from "../../../components/AvancoRodada/index.jsx";
import BotaoReiniciar from "../../../components/BotaoReiniciar/index.jsx";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import FiguraConteudo from "../../../components/FiguraConteudo/index.jsx";
import QuadroFigura from "../../../components/QuadroFigura/index.jsx";
import PalavraRevelada from "../../../components/PalavraRevelada/index.jsx";
import TecladoLetras from "../../../components/TecladoLetras/index.jsx";
import PainelDicas from "../../../components/PainelDicas/index.jsx";
import Feedback from "../../../components/Feedback/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import * as S from "./styles";

export default function Escrita({
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
      titulo={t("Vejo e escrevo")}
      descricao={t("Observe a figura e forme o nome, uma letrinha por vez.")}
      emoji="✏️"
      fundo="#d8f3b2"
    >
      <S.Grade>
        <S.Centro>
          <h2>{t(partida.rodada.pergunta)}</h2>
          <AvancoRodada
            key={partida.rodada.id}
            venceu={partida.resultado.venceu}
            reiniciar={partida.reiniciar}
          >
            <QuadroFigura
              efeito={partida.resultado.venceu ? "comemorar" : "nenhum"}
            >
              <FiguraConteudo figura={partida.rodada.figura} />
            </QuadroFigura>
          </AvancoRodada>

          <PalavraRevelada
            texto={partida.rodada.textoExibicao}
            idioma={idioma}
            posicoes={partida.resultado.posicoes}
            mostrarTudo={partida.resultado.venceu}
          />

          <S.Progresso>
            {partida.resultado.venceu
              ? t("Palavra completa!")
              : t(
                  `Próxima letra: ${partida.resultado.proxima + 1} de ${partida.rodada.letras.length}`,
                )}
          </S.Progresso>

          <Feedback feedback={partida.feedback} />

          <TecladoLetras
            alfabeto={partida.alfabeto}
            tentativas={[]}
            corretas={[]}
            encerrado={partida.resultado.venceu}
            escolher={partida.escolher}
          />

          {!partida.resultado.venceu && (
            <S.Rodape>
              <BotaoReiniciar onClick={partida.reiniciar}>
                {t("Trocar figura")}
              </BotaoReiniciar>
            </S.Rodape>
          )}
        </S.Centro>

        <PainelDicas
          dicas={partida.dicas}
          esgotadas={partida.dicasEsgotadas}
          pedir={partida.pedirDica}
          encerrado={partida.resultado.venceu}
        />
      </S.Grade>
    </MolduraJogo>
  );
}
