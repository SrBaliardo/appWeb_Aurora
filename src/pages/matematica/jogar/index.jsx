import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import PartidaOpcoes from "../../../components/PartidaOpcoes/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import * as S from "./styles";

export default function Matematica({
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
      titulo={t("Continhas da turma")}
      descricao={t("Junte, conte e descubra o resultado no seu ritmo.")}
      emoji="🧮"
      fundo="#ffe3a5"
    >
      <PartidaOpcoes partida={partida}>
        <S.Conta
          aria-label={t(
            `${partida.rodada.conta} igual a ${partida.venceu ? partida.rodada.resultado : "quanto?"}`,
          )}
        >
          <span>{partida.rodada.conta} =</span>
          <S.Resultado>
            {partida.venceu && <S.Valor>{partida.rodada.resultado}</S.Valor>}
          </S.Resultado>
        </S.Conta>
      </PartidaOpcoes>
    </MolduraJogo>
  );
}
