import { useInterface } from "../../contexts/interface/index.js";
import * as S from "./styles";

export default function SeletorNivel({ nivel, alterar }) {
  const { t } = useInterface();

  return (
    <S.Barra>
      <span>{t("Escolha seu desafio:")}</span>

      <S.Opcoes role="group" aria-label={t("Dificuldade dos jogos")}>
        <S.Botao
          type="button"
          $ativo={nivel === "facil"}
          aria-pressed={nivel === "facil"}
          onClick={() => alterar("facil")}
        >
          {t("🌱 Fácil")}
        </S.Botao>

        <S.Botao
          type="button"
          $ativo={nivel === "dificil"}
          aria-pressed={nivel === "dificil"}
          onClick={() => alterar("dificil")}
        >
          {t("🌳 Difícil")}
        </S.Botao>
      </S.Opcoes>

      <small>{t("Trocar o nível começa uma nova rodada.")}</small>
    </S.Barra>
  );
}
