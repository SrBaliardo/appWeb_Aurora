import styled, { keyframes } from "styled-components";

const entrar = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const festejar = keyframes`from { opacity: 0; transform: scale(.3) rotate(-15deg); } to { opacity: 1; transform: scale(1) rotate(0); }`;

export const Cena = styled.div`
  width: 245px;
  max-width: 100%;
  margin: 0 auto;
  padding: 12px;
  border-radius: 26px;
  background: #e7f5c5;
  display: grid;
  place-items: center;
  transform: rotate(-3deg);

  svg {
    width: 100%;
    max-height: 190px;
    display: block;
    margin: auto;
    transform: rotate(3deg);
  }
  .peca {
    animation: ${entrar} 0.35s ease;
  }

  .festa {
    transform-box: fill-box;
    transform-origin: center;
    animation: ${festejar} 0.6s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .peca,
    .festa {
      animation: none;
    }
  }
`;

export const Contador = styled.p`
  margin: 14px 0 4px;
  color: #6b7861;
  font-size: 14px;
  font-weight: 700;
`;
