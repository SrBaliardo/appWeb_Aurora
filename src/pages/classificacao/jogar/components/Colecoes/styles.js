import styled, { keyframes } from "styled-components";

const festa = keyframes`0%,100% { transform: scale(1); } 50% { transform: scale(1.035); }`;

export const Area = styled.div`
  width: 100%;
`;

export const Grupos = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 26px;

  @media (max-width: 600px) {
    display: ${({ $quantidade }) => ($quantidade > 3 ? "grid" : "flex")};
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
`;

export const Grupo = styled.button`
  flex: 1 1 145px;
  max-width: 245px;
  min-height: 180px;
  padding: 18px 12px;
  border-radius: 22px;
  color: #385d39;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 2px dashed
    ${({ $resultado }) =>
      $resultado === "acerto"
        ? "#4d9c59"
        : $resultado === "erro"
          ? "#cf7e70"
          : "#b8c891"};
  background: ${({ $resultado }) =>
    $resultado === "acerto"
      ? "#dff3cd"
      : $resultado === "erro"
        ? "#fae4df"
        : "#f3f7e3"};
  animation: ${({ $resultado }) => ($resultado === "acerto" ? festa : "none")}
    0.45s ease;

  &:disabled {
    color: #385d39;
    opacity: 1;
    border-style: solid;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Simbolo = styled.span`
  font-size: 37px;
  line-height: 1;
`;

export const Encontrados = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  min-height: 34px;
  font-size: 29px;
`;

export const Bandeja = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
