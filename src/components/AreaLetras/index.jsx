import { useInterface } from "../../contexts/interface/index.js";
import PalavraRevelada from "../PalavraRevelada/index.jsx";
import TecladoLetras from "../TecladoLetras/index.jsx";
import PainelDicas from "../PainelDicas/index.jsx";
import Feedback from "../Feedback/index.jsx";
import AvancoRodada from "../AvancoRodada/index.jsx";
import BotaoReiniciar from "../BotaoReiniciar/index.jsx";
import * as S from "./styles";

export default function AreaLetras({ partida, instrucao, children }) {
  const { t } = useInterface();
  const {
    rodada,
    resultado,
    feedback,
    tentativas,
    alfabeto,
    escolher,
    reiniciar,
    dicas,
    dicasEsgotadas,
    pedirDica,
  } = partida;

  return (
    <S.Grade>
      <S.Centro>
        <S.Instrucao>{t(instrucao)}</S.Instrucao>
        <S.PistaInicial role="note" aria-label={t("Pista inicial")}>
          <strong>{t("Para começar:")}</strong> {t(rodada.pistaInicial)}
        </S.PistaInicial>

        <AvancoRodada
          key={rodada.id}
          venceu={resultado.venceu}
          reiniciar={reiniciar}
        >
          {children}
        </AvancoRodada>

        <PalavraRevelada
          texto={rodada.texto}
          idioma={rodada.idioma}
          posicoes={resultado.posicoes}
          mostrarTudo={resultado.encerrou}
        />

        <Feedback feedback={feedback} />

        <TecladoLetras
          alfabeto={alfabeto}
          tentativas={tentativas}
          corretas={resultado.corretas}
          bloqueadas={resultado.bloqueadas}
          encerrado={resultado.encerrou}
          escolher={escolher}
        />

        {!resultado.venceu && (
          <S.Rodape>
            <BotaoReiniciar
              variant={resultado.encerrou ? "contained" : "outlined"}
              onClick={reiniciar}
            >
              {resultado.encerrou ? t("Outra palavra") : t("Trocar palavra")}
            </BotaoReiniciar>
          </S.Rodape>
        )}
      </S.Centro>

      <PainelDicas
        dicas={dicas}
        esgotadas={dicasEsgotadas}
        pedir={pedirDica}
        encerrado={resultado.encerrou}
      />
    </S.Grade>
  );
}
