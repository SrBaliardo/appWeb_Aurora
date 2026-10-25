import { useInterface } from "../../contexts/interface/index.js";
import * as S from "./styles";

export default function TecladoLetras({
  alfabeto,
  tentativas,
  corretas,
  encerrado,
  escolher,
  bloqueadas = [],
}) {
  const { t } = useInterface();

  return (
    <>
      <S.Teclado role="group" aria-label={t("Escolha uma letra")}>
        {alfabeto.map((letra) => {
          const usada = tentativas.includes(letra);
          const fixa = bloqueadas.includes(letra);
          const correta = corretas.includes(letra) || fixa;

          return (
            <S.Tecla
              key={letra}
              type="button"
              disabled={encerrado || usada || fixa}
              $correta={correta}
              onClick={() => escolher(letra)}
              aria-label={t(
                `${letra}${fixa ? ", já aparece na palavra" : usada ? (correta ? ", acertou" : ", já tentou") : ""}`,
              )}
            >
              {letra}
              {usada || fixa ? (correta ? " ✓" : " ·") : ""}
            </S.Tecla>
          );
        })}
      </S.Teclado>

      <S.Nota>{t("Você também pode usar as letras do teclado.")}</S.Nota>
    </>
  );
}
