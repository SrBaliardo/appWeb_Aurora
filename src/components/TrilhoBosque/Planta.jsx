import * as S from "./styles";

export default function Planta({ id, vertical, comprimento }) {
  return (
    <S.Planta
      $vertical={vertical}
      $comprimento={comprimento}
      width="100%"
      height="44"
      focusable="false"
    >
      <defs>
        <pattern
          id={`cipo-${id}`}
          width="144"
          height="44"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 24H144" stroke="#79502c" strokeWidth="7" />

          <path d="M0 22H144" stroke="#bf8c45" strokeWidth="3" />

          <path
            d="M8 21l4 6m67-7 4 6m48-5 4 5"
            stroke="#624728"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <path
            d="M0 24C18 8 54 8 72 24S126 40 144 24"
            fill="none"
            stroke="#3f7e39"
            strokeWidth="4"
          />

          <path
            d="M0 23C18 7 54 7 72 23S126 39 144 23"
            fill="none"
            stroke="#8cbd48"
            strokeWidth="1.5"
          />

          <path
            d="M30 15C14 16 13 4 15 3C27 1 33 7 30 15Z"
            fill="#68a93b"
            stroke="#418239"
            strokeWidth="1"
          />

          <path
            d="M29 15L18 6"
            fill="none"
            stroke="#bce16b"
            strokeWidth="1.3"
          />

          <path
            d="M103 32C104 21 119 21 122 25C118 37 110 39 103 32Z"
            fill="#8abe46"
            stroke="#4d8c3a"
            strokeWidth="1"
          />

          <path d="M104 32l13-5" stroke="#d4e98b" strokeWidth="1.3" />

          <path
            d="M52 13q4-9 9-3t-3 6"
            fill="none"
            stroke="#739f41"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </pattern>
      </defs>

      <rect width="100%" height="44" fill={`url(#cipo-${id})`} />
    </S.Planta>
  );
}
