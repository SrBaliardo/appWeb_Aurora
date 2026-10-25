import styled, { keyframes } from "styled-components";

const brilhar = keyframes`0%,100% { box-shadow: 0 5px 0 #a8c675; } 50% { box-shadow: 0 5px 0 #a8c675, 0 0 0 7px #badd7955; }`;

export const Visual = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 380px;
  max-width: 100%;
`;

export const Modelo = styled.p`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 0 0 14px;
  font-weight: 700;
  color: #507044;

  span {
    font-size: 38px;
  }
`;

export const Cena = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(12px, 2.5vw, 20px);
  padding: clamp(16px, 3vw, 24px);
  width: 380px;
  max-width: 100%;
  border: 3px solid #a8c675;
  border-radius: 23px;
  background: linear-gradient(#e6f5d2 0%, #f3f8da 70%, #c1dd8e 100%);
  box-shadow: 0 5px 0 #a8c675;
  animation: ${({ $venceu }) => ($venceu ? brilhar : "none")} 0.8s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Figura = styled.span`
  display: grid;
  place-items: center;
  min-width: 0;
  aspect-ratio: 1;
  font-size: clamp(25px, 4vw, 35px);
  line-height: 1;
`;
