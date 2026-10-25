import { useInterface } from "../../contexts/interface/index.js";
const figuras = {
  circulo: <circle cx="80" cy="80" r="62" />,
  quadrado: <rect x="22" y="22" width="116" height="116" rx="3" />,
  triangulo: <path d="M80 14 148 140H12Z" />,
  retangulo: <rect x="10" y="39" width="140" height="82" rx="3" />,
  losango: <path d="m80 9 48 71-48 71L32 80Z" />,
  pentagono: <path d="m80 10 67 49-26 80H39L13 59Z" />,
  hexagono: <path d="m44 18 72 0 36 62-36 62H44L8 80Z" />,
  octogono: <path d="M52 12h56l40 40v56l-40 40H52l-40-40V52Z" />,
  trapezio: <path d="M46 28h68l35 104H11Z" />,
  oval: <ellipse cx="80" cy="80" rx="69" ry="43" />,
  estrela: (
    <path d="m80 10 21 43 47 7-34 33 8 47-42-22-42 22 8-47-34-33 47-7Z" />
  ),
  coracao: (
    <path d="M80 140C16 100 4 67 24 39c17-23 44-15 56 3 12-18 39-26 56-3 20 28 8 61-56 101Z" />
  ),
};

export default function FiguraGeometrica({
  forma,
  cor = "#8852c7",
  descricao = "Figura para observar",
}) {
  const { t } = useInterface();

  return (
    <svg
      viewBox="0 0 160 160"
      preserveAspectRatio="xMidYMid meet"
      fill={cor}
      stroke="#314a3c44"
      strokeWidth="3"
      strokeLinejoin="round"
      role="img"
      aria-label={t(descricao)}
    >
      {figuras[forma]}
    </svg>
  );
}
