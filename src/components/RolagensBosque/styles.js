import styled from "styled-components";

export const Posicao = styled.div`
  position: fixed;
  z-index: 1400;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: ${({ $vertical, $comprimento }) =>
    $vertical ? "44px" : `${$comprimento}px`};
  height: ${({ $vertical, $comprimento }) =>
    $vertical ? `${$comprimento}px` : "44px"};
`;
