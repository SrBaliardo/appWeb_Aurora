import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import AreaLetras from "../../../components/AreaLetras/index.jsx";
import QuadroFigura from "../../../components/QuadroFigura/index.jsx";
import FiguraConteudo from "../../../components/FiguraConteudo/index.jsx";
import { usePartida } from "./hooks/usePartida.js";

export default function Palavras({
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
      titulo={t("Cadê a letrinha?")}
      descricao={t("Algumas letras saíram para passear. Vamos encontrá-las?")}
      emoji="🔤"
      fundo="#eee4f9"
    >
      <AreaLetras
        partida={partida}
        instrucao={t("Complete a palavra com as letras que faltam.")}
      >
        <QuadroFigura
          tamanho={124}
          fundo="#e9d1ff"
          borda="#ad75dc"
          tracejada
          decorativo
          efeito={partida.resultado.venceu ? "respirar" : "nenhum"}
        >
          <FiguraConteudo
            figura={partida.resultado.venceu ? partida.rodada.emoji : "?"}
          />
        </QuadroFigura>
      </AreaLetras>
    </MolduraJogo>
  );
}
