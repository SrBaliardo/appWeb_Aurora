import styled from "styled-components";
import Button from "@mui/material/Button";

export const Intro = styled.header`
  margin: 36px 0 26px;

  span {
    color: #6b7925;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1px;
  }

  h1 {
    font-size: clamp(30px, 4vw, 46px);
    margin: 12px 0;
    letter-spacing: -1px;
  }

  p {
    color: #64785e;
    line-height: 1.7;
  }

  small {
    color: #687857;
  }
`;

export const Destaque = styled.section`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 34px;
  padding: 30px;
  border-radius: 30px;
  background: linear-gradient(120deg, #e0f3b1, #fff0b7);
  border: 1px solid #c7df95;

  img {
    display: block;
    width: 100%;
    aspect-ratio: 3/2;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 8px 18px #496e2933;
    transform: rotate(-2deg);
  }

  h2 {
    font-size: clamp(25px, 3vw, 34px);
    margin: 16px 0 12px;
  }

  p {
    color: #5c7153;
    line-height: 1.7;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    padding: 23px;
    gap: 20px;
  }
`;

export const Selo = styled.span`
  display: inline-block;
  padding: 8px 12px;
  border-radius: 20px;
  background: #fff4c4;
  color: #805515;
  font-weight: 800;
  font-size: 13px;
`;

export const Botao = styled(Button)`
  && {
    background: #188548;
    border-radius: 14px;
    padding: 12px 24px;
    box-shadow: 0 4px 0 #116232;

    &:hover {
      background: #106534;
    }
  }
`;

export const Acoes = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 10px;

  > * {
    min-width: 0;
  }

  && button {
    padding: 10px;
    font-size: 14px;
    line-height: 1.4;
    text-transform: none;
  }
`;

export const Download = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 10px;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  border: 2px solid #a7c36e;
  border-radius: 14px;
  background: #fffaf0;
  color: #36653b;
`;

export const Formato = styled.small`
  display: block;
  text-align: right;
  margin-top: 12px;
  color: #66734c;
  font-size: 12px;
`;

export const Subtitulo = styled.h2`
  margin: 36px 0 22px;
  font-size: 26px;
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 42px;

  @media (max-width: 780px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 440px) {
    grid-template-columns: 1fr;
  }
`;

export const Livro = styled.article`
  padding: 15px;
  background: #fffdf4;
  border: 1px solid #e5dfbb;
  border-radius: 21px;
  box-shadow: 0 4px 0 #eee3bb;

  img {
    display: block;
    width: 100%;
    aspect-ratio: 3/2;
    object-fit: contain;
    border-radius: 10px;
  }

  h3 {
    font-size: 18px;
    line-height: 1.4;
  }

  span {
    color: #6d7c61;
    font-size: 13px;
  }
`;
