import styled from "styled-components";

export const AvisoOpcoes = styled.p`
  margin: 0 0 12px;
  color: #62776a;
  font-size: 13px;
  line-height: 1.5;

  &:empty {
    margin: 0;
  }
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 235px;
  gap: 28px;
  align-items: start;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Centro = styled.div`
  text-align: center;
  min-width: 0;
`;

export const Pergunta = styled.h2`
  font-size: clamp(21px, 4vw, 27px);
  margin: 0 0 12px;
`;

export const Contador = styled.p`
  font-size: 14px;
  color: #68775e;
  margin: 0 0 22px;
`;

export const Rodape = styled.div`
  margin-top: 24px;
`;
