import styled from "styled-components";

export const Area = styled.section`
  max-width: 940px;
  margin: 0 auto;
  padding: 28px 0 56px;
`;

export const Voltar = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  text-decoration: none;
  color: #547366;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 20px;

  &:hover {
    color: #194d3e;
  }
`;

export const Cabecalho = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 26px;

  @media (max-width: 600px) {
    align-items: flex-start;
    gap: 12px;
  }
`;

export const Emblema = styled.span`
  width: 70px;
  height: 70px;
  background: ${({ $fundo }) => $fundo};
  border-radius: 24px;
  display: grid;
  place-items: center;
  font-size: 36px;
  flex-shrink: 0;
  transform: rotate(-5deg);

  @media (max-width: 600px) {
    width: 54px;
    height: 54px;
    font-size: 28px;
    border-radius: 18px;
  }
`;

export const Titulo = styled.h1`
  font-size: clamp(27px, 4vw, 38px);
  margin: 0 0 6px;
  letter-spacing: -1px;
  line-height: 1.15;
`;

export const Descricao = styled.p`
  margin: 0;
  color: #62776a;
  line-height: 1.6;
  font-size: 16px;
`;

export const Painel = styled.div`
  border: 1px solid #e3dfbb;
  background: #ffffff;
  border-radius: 30px;
  padding: clamp(18px, 4vw, 36px);
  box-shadow: 0 8px 0 #f0e6bd;
`;

export const Preferencias = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;

  > * {
    flex: 1;
    margin-bottom: 0;
  }

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
