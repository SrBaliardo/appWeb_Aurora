import styled from "styled-components";

export const Barra = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  margin: 0 0 24px;

  > span {
    font-size: 13px;
    color: #596f4d;
    font-weight: 700;
  }

  small {
    width: 100%;
    text-align: right;
    font-size: 12px;
    color: #707b65;
  }

  @media (max-width: 600px) {
    justify-content: center;

    small {
      text-align: center;
    }
  }
`;

export const Opcoes = styled.div`
  display: inline-flex;
  gap: 5px;
  border: 1px solid #c8dcad;
  border-radius: 16px;
  background: #fff;
  padding: 4px;
`;

export const Botao = styled.button`
  min-height: 44px;
  padding: 8px 16px;
  border: 0;
  border-radius: 12px;
  font-weight: 800;
  background: ${({ $ativo }) => ($ativo ? "#dbf1ab" : "transparent")};
  color: #315d32;

  &:hover {
    background: #ecf7cf;
  }
`;
