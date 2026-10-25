import styled from "styled-components";

export const Intro = styled.header`
  margin: 36px 0 26px;

  span {
    color: #85621b;
    font-weight: 800;
    letter-spacing: 2px;
    font-size: 13px;
  }

  h1 {
    font-size: clamp(30px, 4vw, 46px);
    margin: 14px 0;
  }

  p {
    color: #607651;
    line-height: 1.6;
  }
`;

export const Destaque = styled.section`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 30px;
  align-items: center;
  padding: 30px;
  border: 2px solid #e1c775;
  border-radius: 30px;
  background: linear-gradient(120deg, #f7e8ac, #e2f5bb);

  img {
    width: 100%;
    aspect-ratio: 3/2;
    object-fit: contain;
    background: white;
    border: 4px solid #fffdf1;
    border-radius: 14px;
    box-shadow: 0 8px 18px #61773533;
    transform: rotate(-2deg);
  }

  h2 {
    font-size: clamp(25px, 3vw, 34px);
  }

  p {
    line-height: 1.7;
    color: #5b704c;
  }

  small {
    display: block;
    margin-top: 16px;
    color: #666f45;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    padding: 22px;
  }
`;

export const Selo = styled.span`
  display: inline-block;
  background: #fff8d4;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 800;
  color: #7c5918;
`;

export const Acoes = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  > * {
    min-width: 0;
  }

  && button,
  && a {
    padding: 10px 8px;
    font-size: 14px;
    line-height: 1.4;
  }

  svg {
    flex: 0 0 22px;
  }

  @media (max-width: 450px) {
    && button,
    && a {
      font-size: 12px;
    }
  }
`;

export const Formato = styled.small`
  text-align: right;
  display: block;
`;

const acao = `display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 12px 19px; border-radius: 14px; font: inherit; font-weight: 800; text-decoration: none;`;

export const Botao = styled.button`
  ${acao} background: #21894a;
  color: white;
  border: 2px solid #16713a;
  box-shadow: 0 3px 0 #146633;

  &:hover {
    background: #166c38;
  }
`;

export const Download = styled.a`
  ${acao} background: #fffaf0;
  color: #36653b;
  border: 2px solid #a7c36e;
`;

export const Subtitulo = styled.h2`
  margin: 36px 0 24px;
  font-size: 26px;
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 40px;

  @media (max-width: 780px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 440px) {
    grid-template-columns: 1fr;
  }
`;

export const Livro = styled.article`
  padding: 15px;
  border: 1px solid #dfd9b1;
  background: #fffdf5;
  border-radius: 21px;
  box-shadow: 0 4px 0 #eae0b1;

  img {
    width: 100%;
    aspect-ratio: 3/2;
    object-fit: contain;
    display: block;
    border-radius: 12px;
  }

  h3 {
    font-size: 18px;
    line-height: 1.4;
  }

  span {
    color: #63785a;
    font-size: 13px;
  }
`;
