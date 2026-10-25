import styled, { keyframes } from "styled-components";

const respirar = keyframes`0%,100% { transform: scale(1); } 50% { transform: scale(1.07); }`;
const aparecer = keyframes`from { opacity: 0; } to { opacity: 1; }`;

export const Area = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 78px;
  margin: 14px auto 25px;

  @media (max-width: 600px) {
    padding: 0 0 96px;
  }
`;

export const Visual = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  min-width: 0;
  max-width: 100%;
  width: ${({ $largo }) => ($largo ? "100%" : "fit-content")};

  > * {
    margin: 0;
  }
`;

export const Botao = styled.button`
  position: absolute;
  left: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  flex: 0 0 64px;
  min-width: 64px;
  min-height: 82px;
  padding: 4px 0;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: #216638;
  font-size: 13px;
  font-weight: 800;
  animation: ${aparecer} 0.3s ease-out;

  @media (max-width: 600px) {
    left: 50%;
    top: calc(100% + 14px);
    transform: translateX(-50%);
  }

  &:hover > span:first-child {
    background: #106534;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Circulo = styled.span`
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: #fff;
  background: #188548;
  box-shadow: 0 4px 0 #106534;
  animation: ${respirar} 2s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
