export function Cena({ imagem }) {
  if (imagem.tipo === "retrato")
    return (
      <svg width="300" height="300" viewBox={imagem.recorte}>
        <image href={imagem.src} width="1536" height="1024" />
      </svg>
    );
  const mar = ["peixe", "polvo", "tartaruga"].includes(imagem.id);
  const brinquedo = ["bola", "ursinho", "trem"].includes(imagem.id);

  return (
    <>
      <rect
        width="300"
        height="300"
        fill={mar ? "#96e4f5" : brinquedo ? "#ffdf93" : "#c8edb4"}
      />
      {mar ? (
        <>
          <path d="M0 65Q50 35 100 65T200 65T300 65V0H0Z" fill="#c8f5ff" />
          <path d="M0 270Q70 240 140 270T300 270V300H0Z" fill="#fce4a3" />
          <g fill="none" stroke="#eaffff" strokeWidth="4">
            <circle cx="45" cy="110" r="12" />
            <circle cx="252" cy="150" r="17" />
            <circle cx="225" cy="40" r="8" />
          </g>
          <path
            d="M35 285q-20-40 0-75m0 45q25-20 20-45M265 285q25-45 0-83"
            fill="none"
            stroke="#32af8b"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="m225 255 7 12 15 2-11 10 2 14-13-7-13 7 2-14-11-10 15-2Z"
            fill="#ff9873"
          />
        </>
      ) : brinquedo ? (
        <>
          <path d="M0 240H300V300H0Z" fill="#d1b8ee" />
          <path
            d="M0 262H300M45 240v60M145 240v60M245 240v60"
            stroke="#b49bd1"
            strokeWidth="3"
          />
          <circle cx="47" cy="55" r="19" fill="#f78c83" />
          <path d="m245 35 22 40h-44Z" fill="#71bed9" />
          <rect
            x="27"
            y="158"
            width="29"
            height="29"
            rx="5"
            fill="#80b970"
            transform="rotate(-15 40 170)"
          />
          <path
            d="m238 148 6 12 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2Z"
            fill="#fff6c5"
          />
        </>
      ) : (
        <>
          <circle cx="244" cy="48" r="26" fill="#ffd663" />
          <path d="M0 215Q85 175 165 220T300 205V300H0Z" fill="#7fc977" />
          <path
            d="M35 220v-95M268 225v-110"
            stroke="#a47644"
            strokeWidth="13"
          />
          <g fill="#55a85e">
            <circle cx="35" cy="92" r="41" />
            <circle cx="266" cy="81" r="43" />
          </g>
          <g stroke="#37975a" strokeWidth="4">
            <path d="M40 285v-25M254 285v-28" />
          </g>
          <g fill="#fff5c0">
            <circle cx="40" cy="253" r="11" />
            <circle cx="254" cy="250" r="11" />
          </g>
          <g fill="#f5a647">
            <circle cx="40" cy="253" r="4" />
            <circle cx="254" cy="250" r="4" />
          </g>
        </>
      )}
      <text
        x="150"
        y="205"
        textAnchor="middle"
        fontSize="145"
        fontFamily="'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif"
      >
        {imagem.emoji}
      </text>
    </>
  );
}

export default function Imagem({ imagem, descricao }) {
  return (
    <svg
      viewBox="0 0 300 300"
      role={descricao ? "img" : undefined}
      aria-label={descricao}
      aria-hidden={!descricao || undefined}
    >
      <Cena imagem={imagem} />
    </svg>
  );
}
