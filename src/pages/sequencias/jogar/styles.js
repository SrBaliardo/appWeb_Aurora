import styled, { css, keyframes } from "styled-components";

const acertar = keyframes`0%,100% { transform: scale(1); } 50% { transform: scale(1.12); }`;

export const Sequencia = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 440px;
  padding: 6px 0;
`;

export const Celula = styled.div`
  position: relative;
  width: clamp(48px, 10vw, 64px);
  height: 64px;
  padding: 8px 6px;
  border: ${({ $final }) =>
    `2px ${$final ? "dashed #80af56" : "solid #ead399"}`};
  border-radius: 15px;
  display: grid;
  place-items: center;
  font-size: 34px;
  background: ${({ $final, $venceu }) =>
    $final && $venceu ? "#d7f0b1" : "#fff7dc"};
  ${({ $final, $venceu }) => css`
    animation: ${$final && $venceu ? acertar : "none"} 0.6s ease;
  `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
