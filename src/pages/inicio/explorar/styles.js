import styled from "styled-components";
import Button from "@mui/material/Button";

export const Hero = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 12px;
  margin: 30px 0 42px;
  padding: 34px 34px 26px 42px;
  border-radius: 36px;
  background: linear-gradient(115deg, #e6f8bb 0%, #edfacd 47%, #fff0b5 100%);
  border: 1px solid #c4e696;
  overflow: hidden;
  position: relative;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    padding: 28px 24px 8px;
    margin-top: 22px;
    gap: 0;
  }
`;

export const Controles = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
`;

export const Controle = styled.button`
  display: grid;
  place-items: center;
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 50%;
  background: #ffffff9c;
  color: #285f38;
  cursor: pointer;

  &:hover {
    background: #fffdf1;
  }
`;

export const Indicador = styled.button`
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;

  &::after {
    content: "";
    width: ${({ $ativo }) => ($ativo ? "25px" : "11px")};
    height: 11px;
    border-radius: 10px;
    background: ${({ $ativo }) => ($ativo ? "#258043" : "#8ca56d")};
  }
`;

export const EstadoDestaque = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

export const Capas = styled.div`
  position: relative;
  min-height: 330px;
  display: grid;
  place-items: center;

  img {
    position: absolute;
    width: 79%;
    aspect-ratio: 3/2;
    object-fit: contain;
    border: 3px solid #fffbea;
    border-radius: 10px;
    box-shadow: 0 10px 20px #30572340;
  }

  img:first-child {
    transform: translate(-24px, -45px) rotate(-11deg);
  }

  img:nth-child(2) {
    z-index: 1;
    transform: rotate(3deg);
  }

  img:last-child {
    transform: translate(23px, 49px) rotate(11deg);
  }

  @media (max-width: 760px) {
    min-height: 300px;
    margin-top: 15px;
  }
`;

export const TextoHero = styled.div`
  position: relative;
  z-index: 1;
`;

export const Simbolo = styled.span`
  font-size: 47px;
`;

export const Selo = styled.span`
  display: inline-flex;
  gap: 7px;
  align-items: center;
  font-size: 12px;
  font-weight: 800;
  color: #356120;
  background: #d1ef8b;
  border-radius: 20px;
  padding: 8px 12px;
  letter-spacing: 1px;
`;

export const Titulo = styled.h1`
  font-size: clamp(37px, 4.6vw, 61px);
  line-height: 1.09;
  letter-spacing: -2.6px;
  margin: 23px 0 18px;
  color: #246035;
  font-weight: 800;

  span {
    color: #a94708;
  }

  @media (max-width: 760px) {
    max-width: 480px;
    font-size: clamp(36px, 8vw, 51px);
    letter-spacing: -1.8px;
  }
`;

export const Descricao = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: #526848;
  max-width: 350px;
  margin: 0 0 25px;
`;

export const Botao = styled(Button)`
  && {
    border-radius: 15px;
    padding: 13px 23px;
    background: #188548;
    box-shadow: 0 4px 0 #116232;

    &:hover {
      background: #106534;
      box-shadow: 0 4px 0 #0d4e29;
    }
  }
`;

export const NotaHero = styled.p`
  font-size: 12px;
  color: #596b47;
  margin-top: 19px;
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const Arte = styled.div`
  margin: 0 -12px 0 0;
  min-width: 0;
  transform: rotate(1.5deg);

  @media (max-width: 760px) {
    max-width: 580px;
    margin: 18px auto 22px;
    width: 100%;
    transform: none;
  }
`;

export const CabecalhoJogos = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  scroll-margin-top: 30px;

  h2 {
    font-size: clamp(25px, 3vw, 32px);
    margin: 0 0 8px;
    letter-spacing: -0.9px;
  }

  p {
    font-size: 15px;
    color: #6e7c70;
    margin: 0;
    line-height: 1.6;
  }

  > span {
    color: #7c826e;
    font-size: 13px;
    white-space: nowrap;
    padding-bottom: 3px;
  }

  @media (max-width: 600px) {
    > span {
      display: none;
    }
  }
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 950px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 450px) {
    gap: 14px;
  }
`;

export const Cartao = styled.a`
  text-decoration: none;
  border-radius: 25px;
  background: #ffffff;
  padding: 14px;
  border: 1px solid #e4dfbd;
  box-shadow: 0 5px 0 #f0e6bd;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 0 #e6d8a7;
  }
`;

export const Miniatura = styled.div`
  background: ${({ $fundo }) => $fundo};
  border-radius: 17px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  gap: 5px;

  &::after {
    content: "";
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: #ffffff30;
    position: absolute;
    right: -45px;
    top: -50px;
  }

  @media (max-width: 450px) {
    height: 124px;
  }
`;

export const CorpoCartao = styled.div`
  padding: 17px 5px 4px;
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 19px;
    margin: 0 0 9px;
    letter-spacing: -0.4px;
  }

  p {
    font-size: 13px;
    color: #727e70;
    line-height: 1.6;
    margin: 0 0 20px;
    flex: 1;
  }

  @media (max-width: 450px) {
    padding: 14px 0 4px;

    h3 {
      font-size: 17px;
    }

    p {
      font-size: 12px;
    }
  }
`;

export const Categoria = styled.span`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ $cor }) => $cor};
  display: block;
  margin-bottom: 9px;
`;

export const Jogar = styled.span`
  font-weight: 800;
  font-size: 13px;
  color: #427157;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Letras = styled.span`
  background: #fffef5;
  font-size: 30px;
  font-weight: 800;
  width: 42px;
  height: 52px;
  color: #327437;
  border-radius: 9px;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 0 #56913f55;
  transform: rotate(${({ $angulo }) => $angulo || 0}deg);

  @media (max-width: 450px) {
    width: 31px;
    height: 42px;
    font-size: 23px;
  }
`;

export const Cartinhas = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 46px);
  gap: 7px;
  transform: rotate(-9deg);

  span {
    display: grid;
    place-items: center;
    height: 46px;
    background: #fffef5;
    border-radius: 9px;
    font-size: 27px;
    box-shadow: 0 3px 0 #248dac66;
  }
`;

export const Forminhas = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  span:nth-child(1) {
    width: 41px;
    height: 41px;
    border-radius: 50%;
    background: #ffca27;
    align-self: end;
  }

  span:nth-child(2) {
    width: 49px;
    height: 60px;
    border-radius: 12px;
    background: #f77548;
    transform: rotate(-12deg);
  }

  span:nth-child(3) {
    width: 40px;
    height: 40px;
    background: #2d9b67;
    transform: rotate(14deg);
    border-radius: 7px;
  }
`;

export const Convite = styled.aside`
  display: flex;
  align-items: center;
  gap: 18px;
  border-radius: 23px;
  border: 1px dashed #a7cd6a;
  padding: 22px 28px;
  margin: 36px 0 44px;
  background: #eef7d4;

  > span {
    font-size: 34px;
  }

  h2 {
    font-size: 17px;
    margin: 0 0 5px;
  }

  p {
    font-size: 14px;
    color: #75806b;
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 600px) {
    padding: 20px;
    align-items: flex-start;
  }
`;

export const ArteColorir = styled.div`
  position: relative;
  padding: 25px 15px 35px;
  min-height: 320px;
  display: grid;
  place-items: center;

  img {
    width: 95%;
    aspect-ratio: 3/2;
    object-fit: contain;
    background: white;
    border: 6px solid #fffdf0;
    border-radius: 20px;
    box-shadow: 0 9px 0 #bf9b5440;
    transform: rotate(-4deg);
  }

  span {
    position: absolute;
    right: 0;
    bottom: 15px;
    font-size: 70px;
    transform: rotate(10deg);
  }

  i {
    position: absolute;
    bottom: 10px;
    left: 30px;
    color: #df5b6d;
    font-size: 35px;
    font-style: normal;
    letter-spacing: 6px;
    background: #fff4c5;
    border: 3px solid #ecc96a;
    padding: 0 18px;
    border-radius: 30px;
  }
`;
