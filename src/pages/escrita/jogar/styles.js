import styled from "styled-components";

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

  h2 {
    font-size: 23px;
    margin-top: 0;
  }
`;

export const Progresso = styled.p`
  color: #68775e;
  font-size: 14px;
  margin: 14px 0;
`;

export const Rodape = styled.div`
  margin-top: 24px;
`;
