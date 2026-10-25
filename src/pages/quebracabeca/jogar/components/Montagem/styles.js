import styled from "styled-components";

export const Mesa = styled.div`
  display: grid;
  grid-template-columns: ${({ $compacta }) =>
    $compacta
      ? "minmax(96px, 150px) minmax(0,468px) minmax(96px, 150px)"
      : "minmax(72px, 115px) minmax(0,468px) minmax(72px, 115px)"};
  gap: 20px;
  justify-content: center;
  align-items: start;
  margin: 25px auto;
  max-width: 100%;

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;

    > :nth-child(2) {
      grid-column: 1 / -1;
      grid-row: 1;
    }
  }
`;

export const Bandeja = styled.div`
  display: grid;
  grid-template-columns: ${({ $compacta }) =>
    $compacta ? "repeat(2,minmax(0,1fr))" : "minmax(0,1fr)"};
  justify-items: center;
  align-items: center;
  gap: 6px;
  min-width: 0;

  @media (max-width: 760px) {
    grid-column: ${({ $lado }) => ($lado === "esquerda" ? 1 : 2)};
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
`;

export const EspacoPeca = styled.div`
  width: 100%;
  aspect-ratio: 1;
  max-width: 85px;
`;

export const Peca = styled.button`
  display: block;
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
  border-radius: 14px;
  border: 2px solid
    ${({ $selecionada }) => ($selecionada ? "#3b8c50" : "transparent")};
  background: ${({ $selecionada }) => ($selecionada ? "#dcf0b7" : "#f4efd9")};
  min-width: 44px;
  min-height: 44px;
  cursor: grab;
  opacity: ${({ $arrastando }) => ($arrastando ? 0.15 : 1)};
  transform: rotate(${({ $angulo }) => $angulo}deg);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;

  svg {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
    filter: drop-shadow(0 3px 2px #24451a30);
  }

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline-offset: 3px;
  }
`;

export const Fantasma = styled.div.attrs(({ $x, $y }) => ({
  style: { transform: `translate3d(${$x - 65}px, ${$y - 65}px, 0)` },
}))`
  position: fixed;
  top: 0;
  left: 0;
  width: 130px;
  height: 130px;
  z-index: 1600;
  pointer-events: none;
  filter: drop-shadow(0 8px 9px #294a2844);
  transition: ${({ $voltando }) =>
    $voltando ? "transform .18s ease-out" : "none"};

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
