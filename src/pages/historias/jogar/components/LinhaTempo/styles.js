import styled, { css, keyframes } from "styled-components";

const festa = keyframes`0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); }`;

export const Area = styled.div`
  width: 100%;
`;

const gradeCenas = css`
  display: grid;
  grid-template-columns: repeat(${({ $total }) => $total}, minmax(0, 1fr));
  grid-auto-rows: 200px;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Linha = styled.div`
  ${gradeCenas} margin-bottom: 24px;
`;

export const Espaco = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 200px;
  padding: 30px 10px 14px;
  border-radius: 18px;
  touch-action: ${({ $ocupado }) => ($ocupado ? "none" : "auto")};
  user-select: none;
  -webkit-user-select: none;
  opacity: ${({ $arrastando }) => ($arrastando ? 0.3 : 1)};

  &&:not(:disabled) {
    cursor: ${({ $ocupado }) => ($ocupado ? "grab" : "pointer")};
  }

  background: ${({ $resultado, $sobre }) =>
    $resultado === true
      ? "#e3f3bd"
      : $resultado === false
        ? "#fce9df"
        : $sobre
          ? "#fff0be"
          : "#f4f0fb"};
  border: 2px dashed
    ${({ $resultado, $sobre }) =>
      $resultado === true
        ? "#76ad52"
        : $resultado === false
          ? "#d78873"
          : $sobre
            ? "#c99b45"
            : "#c5addc"};
  color: #5a4371;

  > span {
    font-size: 13px;
    line-height: 1.6;
  }

  &:disabled {
    opacity: 1;
    color: #365b37;
    border-style: solid;
    animation: ${festa} 0.65s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    &:disabled {
      animation: none;
    }
  }
`;

export const Numero = styled.strong`
  position: absolute;
  top: 7px;
  left: 10px;
  color: #83669a;
  font-size: 14px;
`;

export const Figura = styled.i`
  font-style: normal;
  font-size: 43px;
  line-height: 1.1;
`;

export const Bandeja = styled.div`
  ${gradeCenas} > button {
    height: 100%;
  }
`;

export const PecaVisual = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 10px;
  border: 2px solid #b89cce;
  border-radius: 18px;
  background: #fff8e4;
  color: #5a4371;
  box-shadow: 0 10px 18px #294a2844;

  span {
    font-size: 13px;
    line-height: 1.5;
    font-weight: 700;
    text-align: center;
  }
`;
