import styled, { keyframes } from "styled-components";

const passos = keyframes`from { transform: translateX(-1px) rotate(-4deg); } to { transform: translateX(1px) rotate(4deg); }`;

export const Trilha = styled.div`
  position: relative;
  height: ${({ $vertical, $comprimento }) =>
    $vertical ? `${$comprimento}px` : "44px"};
  width: ${({ $vertical }) => ($vertical ? "44px" : "100%")};
  border: 0;
  background: transparent;
`;

export const Decoracao = styled.div`
  position: absolute;
  top: ${({ $prolongamento }) => -($prolongamento || 0)}px;
  left: ${({ $telaInteira }) => ($telaInteira ? "calc(50% - 50vw)" : "0")};
  width: ${({ $telaInteira }) => ($telaInteira ? "100vw" : "100%")};
  height: calc(100% + ${({ $prolongamento }) => $prolongamento || 0}px);
  overflow: ${({ $vertical }) => ($vertical ? "hidden" : "visible")};
  pointer-events: none;
`;

export const Mecanismo = styled.div`
  position: absolute;
  inset: 0;
  overflow: ${({ $vertical }) => ($vertical ? "hidden" : "visible")};
`;

export const Caminho = styled.div`
  position: absolute;
  inset: ${({ $vertical }) => ($vertical ? "28px 0" : "0 22px")};
  pointer-events: none;
`;

export const Planta = styled.svg`
  display: block;
  overflow: visible;
  ${({ $vertical, $comprimento }) =>
    $vertical &&
    `position: absolute; top: 0; left: 44px; width: ${$comprimento}px; height: 44px; transform: rotate(90deg); transform-origin: top left;`}
`;

export const Inseto = styled.span`
  position: absolute;
  top: ${({ $vertical, $progresso }) =>
    $vertical ? `${$progresso * 100}%` : "0"};
  left: ${({ $vertical, $progresso }) =>
    $vertical ? "50%" : `${$progresso * 100}%`};
  width: 56px;
  height: 44px;
  transform: ${({ $vertical, $direcao }) =>
    $vertical
      ? `translate(-50%,-50%) rotate(${$direcao > 0 ? 90 : -90}deg)`
      : `translateX(-50%) scaleX(${$direcao})`};
  filter: drop-shadow(0 2px 1px #4b613333);

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .pernas-a,
  .pernas-b {
    transform-origin: 31px 24px;
    animation: ${passos} 0.14s linear infinite alternate;
    animation-play-state: ${({ $andando }) =>
      $andando ? "running" : "paused"};
  }
  .pernas-b {
    animation-delay: -0.14s;
  }

  @media (prefers-reduced-motion: reduce) {
    .pernas-a,
    .pernas-b {
      animation: none;
    }
  }
`;

export const Controle = styled.input`
  appearance: none;
  -webkit-appearance: none;
  display: block;
  position: absolute;
  top: 0;
  left: ${({ $vertical }) => ($vertical ? "44px" : "0")};
  z-index: 1;
  margin: 0;
  width: ${({ $vertical, $comprimento }) =>
    $vertical ? `${$comprimento}px` : "100%"};
  height: 44px;
  ${({ $vertical }) =>
    $vertical && "transform: rotate(90deg); transform-origin: top left;"}
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  cursor: grab;
  touch-action: ${({ $vertical }) => ($vertical ? "none" : "pan-y")};

  &:active {
    cursor: grabbing;
  }

  &:focus,
  &:focus-visible {
    outline: none;
  }

  &:focus-visible ~ ${Caminho} ${Inseto} {
    filter: drop-shadow(0 0 3px #b06826) drop-shadow(0 0 2px #fff7c0);
  }

  &::-webkit-slider-runnable-track {
    height: 44px;
    background: transparent;
    border: 0;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: ${({ $vertical }) => ($vertical ? "56px" : "44px")};
    height: 44px;
    background: transparent;
    border: 0;
    box-shadow: none;
  }

  &::-moz-range-track,
  &::-moz-range-progress {
    height: 44px;
    background: transparent;
    border: 0;
  }

  &::-moz-range-thumb {
    width: ${({ $vertical }) => ($vertical ? "56px" : "44px")};
    height: 44px;
    background: transparent;
    border: 0;
    border-radius: 50%;
    box-shadow: none;
  }

  @media (forced-colors: active) {
    appearance: auto;
    -webkit-appearance: auto;

    &::-webkit-slider-thumb {
      appearance: auto;
      -webkit-appearance: auto;
      background: Highlight;
    }

    &::-moz-range-thumb {
      background: Highlight;
    }
  }
`;
