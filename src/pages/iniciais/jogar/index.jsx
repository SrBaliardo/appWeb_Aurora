import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import PartidaOpcoes from "../../../components/PartidaOpcoes/index.jsx";
import QuadroFigura from "../../../components/QuadroFigura/index.jsx";
import FiguraConteudo from "../../../components/FiguraConteudo/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import * as S from "./styles";

export default function Iniciais({
  nivel = "facil",
  alterarNivel,
  idioma = "pt-BR",
  alterarIdioma,
}) {
  const { t } = useInterface();
  const partida = usePartida(nivel, idioma);

  return (
    <MolduraJogo
      titulo={t("Qual é a primeira letrinha?")}
      descricao={t("Descubra como começa o nome de cada figura.")}
      emoji="🔤"
      fundo="#e7d5f7"
      nivel={nivel}
      alterarNivel={alterarNivel}
      idioma={idioma}
      alterarIdioma={alterarIdioma}
    >
      <PartidaOpcoes partida={partida}>
        <S.Visual>
          <QuadroFigura
            tamanho={150}
            angulo={-3}
            fundo="#efddfa"
            borda="#cda8e3"
            efeito={partida.venceu ? "comemorar" : "nenhum"}
          >
            <FiguraConteudo figura={partida.rodada.figura} />
          </QuadroFigura>
          <S.Palavra
            lang={idioma}
            aria-label={
              partida.venceu
                ? partida.rodada.palavra
                : t("Palavra com início faltando: {resto}", {
                    resto: partida.rodada.resto,
                  })
            }
          >
            <S.Inicio $venceu={partida.venceu}>
              {partida.venceu ? partida.rodada.resposta : "?"}
            </S.Inicio>
            {partida.rodada.resto}
          </S.Palavra>
        </S.Visual>
      </PartidaOpcoes>
    </MolduraJogo>
  );
}
