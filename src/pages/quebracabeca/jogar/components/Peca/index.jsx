import { useId } from "react";
import { Cena } from "../Imagem/index.jsx";

export function RecortePeca({ peca, imagem, lado, contorno = true }) {
  const id = `recorte-${useId().replace(/:/g, "")}`;

  return (
    <>
      <defs>
        <clipPath id={id}>
          <path d={peca.caminho} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <svg
          x={-peca.coluna * 100}
          y={-peca.linha * 100}
          width={lado * 100}
          height={lado * 100}
          viewBox="0 0 300 300"
        >
          <Cena imagem={imagem} />
        </svg>
      </g>
      {contorno && (
        <path d={peca.caminho} fill="none" stroke="#fff9e6" strokeWidth="1.5" />
      )}
    </>
  );
}

export default function Peca(props) {
  return (
    <svg viewBox="-20 -20 140 140" aria-hidden="true">
      <RecortePeca {...props} />
    </svg>
  );
}
