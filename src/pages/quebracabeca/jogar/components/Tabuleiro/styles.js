import styled, { keyframes } from "styled-components";

const comemorar = keyframes`0%,100% { transform: scale(1); } 45% { transform: scale(1.055); }`;
const puff = keyframes`0% { opacity: 0; transform: translate(0,0) rotate(0) scale(.2); } 12% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--x),var(--y)) rotate(var(--giro)) scale(.7); }`;
const cores = ["#ffc83d", "#ef8579", "#6cbb75", "#9c86d6", "#65c7df"];

export const Quadro = styled.div`
  position: relative;
  width: 100%;
  max-width: 468px;
  min-width: 0;
  margin: 0 auto;
`;

export const Moldura = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border: 10px solid ${({ $venceu }) => ($venceu ? "#d4a24c" : "#b68d55")};
  border-radius: 18px;
  background: #f0f5df;
  box-shadow:
    inset 0 0 0 3px #fff8dc,
    0 7px 0 #97713e33,
    0 12px 24px #55723a18;

  > svg {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 7px;
    overflow: hidden;
  }

  animation: ${({ $venceu }) => ($venceu ? comemorar : "none")} 0.65s
    ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Vazio = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  color: #60734d;

  span {
    font-size: 64px;
  }

  p {
    max-width: 220px;
    line-height: 1.6;
  }
`;

export const Erro = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 7px;
  background: #fff8df;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 22px;
  text-align: center;
  color: #6c5236;
  line-height: 1.6;
`;

export const Tentar = styled.button`
  min-height: 44px;
  padding: 10px 16px;
  border-radius: 12px;
  background: #ddedb7;
  color: #305b32;
  border: 1px solid #8eb269;
`;

export const Tabuleiro = styled.svg`
  path[role="button"] {
    cursor: pointer;
  }

  path[role="button"]:focus-visible {
    outline: none;
    stroke: #235f3b;
    stroke-width: 3;
    stroke-dasharray: none;
  }
`;

export const Selo = styled.span`
  position: absolute;
  right: -16px;
  bottom: -16px;
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  background: #ffda65;
  color: #84571f;
  border: 3px solid #fff9dd;
  border-radius: 50%;
  font-size: 26px;
  transform: rotate(12deg);
`;

export const Legenda = styled.p`
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #547245;
  margin: 18px 0 0;
  min-height: 22px;
`;

export const Confetes = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  pointer-events: none;
  z-index: 3;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

export const Confete = styled.i`
  --x: ${({ $ordem }) =>
    Math.round(Math.cos($ordem * 2.4) * (95 + ($ordem % 4) * 27))}px;
  --y: ${({ $ordem }) =>
    Math.round(Math.sin($ordem * 2.4) * (95 + ($ordem % 4) * 27))}px;
  --giro: ${({ $ordem }) => 90 + $ordem * 37}deg;
  position: absolute;
  width: 9px;
  height: 14px;
  border-radius: 3px;
  background: ${({ $ordem }) => cores[$ordem % cores.length]};
  animation: ${puff} 0.95s ease-out both;
`;
