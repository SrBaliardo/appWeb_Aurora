import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import PartidaOpcoes from "../../../components/PartidaOpcoes/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import * as S from "./styles";

export default function Contagem({ nivel = "facil", alterarNivel }) {
  const { t } = useInterface();
  const partida = usePartida(nivel);

  return (
    <MolduraJogo
      titulo={t("Quantos há no bosque?")}
      descricao={t("Conte com calma os animais, as frutas e as flores.")}
      emoji="🦋"
      fundo="#dcefb9"
      nivel={nivel}
      alterarNivel={alterarNivel}
    >
      <PartidaOpcoes partida={partida}>
        <S.Visual>
          <S.Modelo>
            {t("Conte somente:")}{" "}
            <span aria-hidden="true">{partida.rodada.alvo.figura}</span>
            <strong>{t(partida.rodada.alvo.nome)}</strong>
          </S.Modelo>

          <S.Cena
            $venceu={partida.venceu}
            role="group"
            aria-label={t("Cena para contar as figuras")}
          >
            {partida.rodada.cena.map((item) => (
              <S.Figura key={item.id} role="img" aria-label={t(item.nome)}>
                {item.figura}
              </S.Figura>
            ))}
          </S.Cena>
        </S.Visual>
      </PartidaOpcoes>
    </MolduraJogo>
  );
}
