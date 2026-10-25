import { useInterface } from "../../../../../contexts/interface/index.js";
import * as S from "./styles";

export default function Boneco({ erros, restantes, venceu }) {
  const { t } = useInterface();

  return (
    <>
      <S.Cena>
        <svg
          viewBox="0 0 240 180"
          role="img"
          aria-label={
            venceu
              ? t("Você descobriu a palavra!")
              : `Boneco com ${erros} de 6 partes`
          }
        >
          <ellipse cx="120" cy="167" rx="95" ry="9" fill="#dce5c9" />
          <path
            d="M38 163V20h112v21M28 163h55M38 45l24-25"
            fill="none"
            stroke="#ad8d65"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M150 29v16" stroke="#d7bb80" strokeWidth="4" />

          {erros >= 1 && (
            <g className="peca">
              <circle
                cx="150"
                cy="61"
                r="19"
                fill="#ffdda7"
                stroke="#876c4b"
                strokeWidth="3"
              />
              <circle cx="144" cy="59" r="2" fill="#6d513c" />
              <circle cx="157" cy="59" r="2" fill="#6d513c" />
              <path
                d="M145 67q5 4 10 0"
                fill="none"
                stroke="#a57753"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )}

          {erros >= 2 && (
            <path
              className="peca"
              d="M150 82v40"
              stroke="#78a694"
              strokeWidth="13"
              strokeLinecap="round"
            />
          )}

          {erros >= 3 && (
            <path
              className="peca"
              d="m145 89-22 20"
              stroke="#d8a774"
              strokeWidth="7"
              strokeLinecap="round"
            />
          )}

          {erros >= 4 && (
            <path
              className="peca"
              d="m155 89 22 20"
              stroke="#d8a774"
              strokeWidth="7"
              strokeLinecap="round"
            />
          )}

          {erros >= 5 && (
            <path
              className="peca"
              d="m147 121-15 26"
              stroke="#8e9db5"
              strokeWidth="8"
              strokeLinecap="round"
            />
          )}

          {erros >= 6 && (
            <path
              className="peca"
              d="m153 121 15 26"
              stroke="#8e9db5"
              strokeWidth="8"
              strokeLinecap="round"
            />
          )}

          <path
            d="m205 151 5-14 5 14m-5-7v19M91 155l4-8 4 8"
            fill="none"
            stroke="#84a875"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {venceu && (
            <g className="festa" fill="#e3ac4b">
              <path d="m190 38 3 6 7 1-5 4 1 7-6-3-6 3 1-7-5-4 7-1Z" />
              <circle cx="100" cy="60" r="4" />
              <circle cx="190" cy="105" r="3" />
            </g>
          )}
        </svg>
      </S.Cena>

      <S.Contador>
        {venceu
          ? t("Palavra descoberta! ✨")
          : t(
              `${restantes} ${restantes === 1 ? "tentativa restante" : "tentativas restantes"}`,
            )}
      </S.Contador>
    </>
  );
}
