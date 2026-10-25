import styled from "styled-components";

export const Cartao = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 10px;
  min-width: 44px;
  min-height: 106px;
  background: ${({ $selecionado }) => ($selecionado ? "#e3f4b8" : "#fff8e4")};
  color: #365b3b;
  border: 2px solid
    ${({ $selecionado }) => ($selecionado ? "#5b9d49" : "#ead9a2")};
  border-radius: 18px;
  box-shadow: 0 4px 0 #dfd3ab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  opacity: ${({ $arrastando }) => ($arrastando ? 0.3 : 1)};

  && {
    cursor: grab;
  }

  &&:active {
    cursor: grabbing;
  }
`;

export const Figura = styled.span`
  font-size: 43px;
  line-height: 1.15;
  pointer-events: none;
`;

export const Legenda = styled.span`
  font-size: 13px;
  line-height: 1.5;
  font-weight: 700;
  pointer-events: none;
`;
