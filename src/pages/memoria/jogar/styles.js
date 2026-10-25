import styled, { keyframes } from "styled-components";
import Button from "@mui/material/Button";

const encontrar = keyframes`0%,100% { transform: scale(1); } 50% { transform: scale(1.07) rotate(3deg); }`;
const brilhar = keyframes`0%,100% { box-shadow: inset 0 0 0 2px #ffffff; } 50% { box-shadow: inset 0 0 0 2px #ffffff, 0 0 0 5px #ffc62c66, 0 0 22px #f4bd3288; }`;

export const Ferramentas = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 22px;
`;

export const Temas = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Tema = styled(Button)`
  && {
    border-radius: 15px;
    font-size: 14px;
    min-height: 46px;
    padding: 9px 14px;
    background: ${({ $ativo }) => ($ativo ? "#dcf4a4" : "#fff8e2")};
    color: #305c29;
    border: 1px solid ${({ $ativo }) => ($ativo ? "#74b63e" : "#e6dcae")};
  }
`;

export const Contadores = styled.div`
  display: flex;
  justify-content: center;
  gap: 28px;
  margin: 18px 0;
  color: #607864;
  font-size: 15px;

  strong {
    color: #294e3c;
  }
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(7px, 2vw, 13px);
  max-width: 468px;
  margin: 0 auto 26px;
`;

export const Carta = styled.button`
  position: relative;
  padding: 0;
  border: 0;
  background: transparent;
  aspect-ratio: 1;
  min-height: 44px;
  perspective: 700px;
  appearance: none;
  -webkit-appearance: none;
  color: #244d2f;
  -webkit-text-fill-color: currentColor;

  &:focus-visible {
    outline-offset: 3px;
    border-radius: 18px;
  }

  &:hover:not(:disabled) > div {
    box-shadow: 0 5px 0 #508e48;
  }

  &:disabled {
    opacity: 1;
    filter: none;
    color: #244d2f;
    -webkit-text-fill-color: currentColor;
  }
`;

export const Interior = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: ${({ $aberta }) => ($aberta ? "rotateY(180deg)" : "rotateY(0)")};
  transition: transform 0.36s ease;
  border-radius: 18px;
  box-shadow: 0 4px 0 #9bbe70;
`;

export const Verso = styled.span`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 17px;
  display: grid;
  place-items: center;
  background: #208b49;
  color: #fff2a3;
  border: 4px solid #3fa95a;
  background-image: radial-gradient(#c6ee9b55 1.4px, transparent 1.4px);
  background-size: 12px 12px;

  svg {
    width: 36%;
    height: 36%;
  }
`;

export const Frente = styled.span`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: rotateY(180deg);
  border-radius: 17px;
  background: ${({ $encontrada }) => ($encontrada ? "#d5fa8a" : "#fffbed")};
  border: 3px solid
    ${({ $encontrada }) => ($encontrada ? "#45a336" : "#ffc63b")};
  box-shadow: inset 0 0 0 2px #ffffff;
  color: #244d2f;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  padding: 4px;
  animation: ${({ $encontrada }) => ($encontrada ? brilhar : "none")} 0.65s ease;
`;

export const Figura = styled.span`
  font-size: clamp(28px, 6vw, 45px);
  line-height: 1.2;
  opacity: 1;
  display: grid;
  place-items: center;
  width: 68%;
  height: 65%;
  border-radius: 10px;
  overflow: hidden;
  font-family:
    "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  animation: ${({ $encontrada }) => ($encontrada ? encontrar : "none")} 0.45s
    ease;
`;

export const Nome = styled.span`
  font-size: clamp(10px, 1.7vw, 12px);
  color: #38532b;
  font-weight: 700;
  line-height: 1.2;
  max-width: 100%;
  overflow-wrap: anywhere;
`;

export const SeloEncontrado = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #278329;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
`;

export const Rodape = styled.div`
  text-align: center;
  margin-top: 22px;
`;
