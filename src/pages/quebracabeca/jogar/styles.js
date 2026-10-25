import styled from "styled-components";
import Button from "@mui/material/Button";

export const Temas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
`;

export const Tema = styled(Button)`
  && {
    display: inline-flex;
    gap: 6px;
    min-height: 46px;
    padding: 9px 14px;
    border-radius: 15px;
    background: ${({ $ativo }) => ($ativo ? "#e2f3ba" : "#fff5d6")};
    color: #355d30;
    border: 1px solid ${({ $ativo }) => ($ativo ? "#8bb95e" : "#e4d7a4")};
  }
`;

export const Cabecalho = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h2 {
    font-size: 18px;
    margin: 0;
  }

  > span {
    font-size: 13px;
    color: #6a7859;
    white-space: nowrap;
  }
`;

export const Miniaturas = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
  padding: 24px 0 12px;
`;

export const Miniatura = styled.button`
  width: clamp(78px, 20vw, 112px);
  padding: 5px;
  background: ${({ $ativa }) => ($ativa ? "#e1f0bb" : "#fffdf1")};
  border: 2px solid ${({ $ativa }) => ($ativa ? "#75a445" : "#e1d6ad")};
  border-radius: 14px;
  cursor: pointer;
  transition:
    transform 0.18s,
    box-shadow 0.18s;
  color: #3c613a;

  svg {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 9px;
  }

  span {
    display: block;
    font-weight: 700;
    font-size: 12px;
    padding: 7px 0 2px;
  }

  &:hover,
  &:focus-visible {
    transform: scale(1.09);
    box-shadow: 0 7px 12px #3b622326;
    position: relative;
    z-index: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
`;

export const Instrucao = styled.p`
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  color: #64765b;
  max-width: 580px;
  margin: 10px auto;
`;

export const Rodape = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 22px;

  span {
    font-size: 13px;
    color: #6c7d5f;
  }
`;
