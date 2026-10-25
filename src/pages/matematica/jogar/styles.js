import styled, { keyframes } from "styled-components";

const revelar = keyframes`
  from { opacity: 0; transform: translateY(7px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Conta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px;
  min-height: 124px;
  max-width: 100%;
  border-radius: 28px;
  background: #fff1bc;
  color: #735326;
  font-size: clamp(27px, 4.5vw, 43px);
  font-weight: 800;
`;

export const Resultado = styled.span`
  display: inline-grid;
  place-items: center;
  min-width: 59px;
  min-height: 1.35em;
  border-bottom: 4px solid #ca9e37;
  padding: 3px 8px;
  color: #34833b;
`;

export const Valor = styled.span`
  display: block;
  line-height: 1;
  animation: ${revelar} 0.4s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
