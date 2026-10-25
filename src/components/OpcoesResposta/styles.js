import styled, { css } from "styled-components";

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 24px 0;
`;

export const Opcao = styled.button`
  min-height: 63px;
  min-width: 0;
  padding: 14px 8px;
  border-radius: 18px;
  border: 2px solid
    ${({ $tentada, $correta }) =>
      $correta ? "#68ad37" : $tentada ? "#e1be8f" : "#e0dfd2"};
  background: ${({ $tentada, $correta }) =>
    $correta ? "#dbf5b0" : $tentada ? "#ffe8bf" : "#fffefa"};
  color: #3c594a;
  font-weight: 800;
  font-size: clamp(13px, 2.6vw, 19px);
  letter-spacing: 0.5px;
  overflow-wrap: anywhere;
  box-shadow: 0 4px 0 #eeece0;
  transition: transform 0.15s;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    border-color: #94b59b;
  }
  ${({ $comAcao }) =>
    $comAcao &&
    css`
      display: grid;
      place-items: center;
      min-height: 78px;
      padding: 12px 42px;
      width: 100%;

      > span {
        min-width: 0;
        max-width: 100%;
      }
    `}
`;

export const Item = styled.div`
  position: relative;
  display: grid;
  min-width: 0;
`;

export const Acao = styled.div`
  position: absolute;
  right: 2px;
  bottom: 2px;
`;
