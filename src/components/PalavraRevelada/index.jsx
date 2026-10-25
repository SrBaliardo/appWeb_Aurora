import { useInterface } from "../../contexts/interface/index.js";
import * as S from "./styles";

export default function PalavraRevelada({
  texto,
  posicoes,
  mostrarTudo,
  idioma = "pt-BR",
}) {
  const { t } = useInterface();

  return (
    <S.Palavra role="group" aria-label={t("Letras da palavra")}>
      {[...texto].map((letra, i) => {
        const visivel = posicoes[i] || mostrarTudo;
        const separador = !/\p{L}/u.test(letra);

        return (
          <S.Letra
            key={i}
            $separador={separador}
            $revelada={Boolean(posicoes[i])}
            aria-label={
              separador
                ? letra === " "
                  ? t("Espaço entre palavras")
                  : t("Hífen")
                : t(
                    `Posição ${i + 1}: ${visivel ? letra : t("letra escondida")}`,
                  )
            }
          >
            {visivel || separador ? (
              <span key={letra} lang={idioma}>
                {letra}
              </span>
            ) : (
              "_"
            )}
          </S.Letra>
        );
      })}
    </S.Palavra>
  );
}
