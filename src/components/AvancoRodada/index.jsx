import { useInterface } from "../../contexts/interface/index.js";
import { useAvancoAposSucesso } from "../../hooks/useAvancoAposSucesso.js";
import Icone from "../Icone/index.jsx";
import * as S from "./styles";

export default function AvancoRodada({
  venceu,
  reiniciar,
  children,
  largo = false,
}) {
  const { t } = useInterface();
  const pronto = useAvancoAposSucesso(venceu);

  return (
    <S.Area>
      <S.Visual $largo={largo}>
        {children}

        {pronto && (
          <S.Botao
            type="button"
            onClick={reiniciar}
            aria-label={t("Iniciar próxima partida")}
            title={t("Iniciar próxima partida")}
          >
            <S.Circulo>
              <Icone nome="seta" tamanho={28} />
            </S.Circulo>

            <span>{t("Próxima")}</span>
          </S.Botao>
        )}
      </S.Visual>
    </S.Area>
  );
}
