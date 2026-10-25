import { useInterface } from "../../contexts/interface/index.js";
import Icone from "../Icone/index.jsx";
import * as S from "./styles";

export default function PainelDicas({ dicas, esgotadas, pedir, encerrado }) {
  const { t } = useInterface();

  return (
    <S.Caixa aria-label={t("Dicas para a palavra")}>
      <S.Titulo>
        <Icone nome="lampada" /> {t("Uma luzinha?")}
      </S.Titulo>

      <S.Texto>{t("Sem pressa! A lâmpada ajuda você a descobrir.")}</S.Texto>

      {dicas.length > 0 && (
        <S.Lista aria-live="polite">
          {dicas.map((dica) => (
            <li key={dica}>{t(dica)}</li>
          ))}
        </S.Lista>
      )}

      <S.Botao
        variant="contained"
        onClick={pedir}
        disabled={esgotadas || encerrado}
        startIcon={<Icone nome="lampada" tamanho={18} />}
      >
        {esgotadas
          ? t("Todas as dicas")
          : dicas.length
            ? t("Mais uma dica")
            : t("Quero uma dica")}
      </S.Botao>
    </S.Caixa>
  );
}
