import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import PartidaOpcoes from "../../../components/PartidaOpcoes/index.jsx";
import FiguraConteudo from "../../../components/FiguraConteudo/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import * as S from "./styles";

export default function Sequencias({ nivel = "facil", alterarNivel }) {
  const { t } = useInterface();
  const partida = usePartida(nivel);

  return (
    <MolduraJogo
      titulo={t("Sequências da Aurora")}
      descricao={t("Observe o padrão e descubra o próximo pedacinho.")}
      emoji="🍎"
      fundo="#f9ddae"
      nivel={nivel}
      alterarNivel={alterarNivel}
    >
      <PartidaOpcoes partida={partida}>
        <S.Sequencia
          role="group"
          aria-label={t("Leia a sequência da esquerda para a direita.")}
        >
          {[
            ...partida.rodada.serie,
            partida.venceu ? partida.rodada.figuraFinal : null,
          ].map((item, indice) => (
            <S.Celula
              key={indice}
              $final={indice === partida.rodada.serie.length}
              $venceu={partida.venceu}
            >
              {item ? (
                <FiguraConteudo
                  figura={item.figura}
                  descricao={t(item.descricao)}
                />
              ) : (
                <span aria-label={t("Figura que falta")}>?</span>
              )}
            </S.Celula>
          ))}
        </S.Sequencia>
      </PartidaOpcoes>
    </MolduraJogo>
  );
}
