import styled from "styled-components";

export const Grade = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 235px;
  align-items: start;
  gap: 28px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const Centro = styled.div`
  text-align: center;
  min-width: 0;
`;

export const Instrucao = styled.p`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 18px;
`;

export const Rodape = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const PistaInicial = styled.p`
  padding: 12px 16px;
  margin: 0 0 18px;
  border-radius: 16px;
  background: #edf5d7;
  color: #3d6034;
  line-height: 1.6;
  font-size: 15px;

  strong {
    color: #315329;
  }
`;
