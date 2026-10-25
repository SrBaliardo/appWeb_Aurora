import styled from "styled-components";

export const Barra = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  > span {
    font-size: 13px;
    color: #596f4d;
    font-weight: 700;
  }

  small {
    width: 100%;
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
  gap: ${({ $compacto }) => ($compacto ? "0" : "5px")};
  border: 1px solid #c8dcad;
  border-radius: 16px;
  background: #fff;
  padding: ${({ $compacto }) => ($compacto ? "2px" : "4px")};
`;

export const Botao = styled.button`
  display: grid;
  place-items: center;
  min-width: ${({ $compacto }) => ($compacto ? "44px" : "52px")};
  min-height: 44px;
  padding: ${({ $compacto }) => ($compacto ? "5px" : "8px")};
  border: 0;
  border-radius: 12px;
  background: ${({ $ativo }) => ($ativo ? "#dbf1ab" : "transparent")};
  box-shadow: ${({ $ativo }) => ($ativo ? "inset 0 0 0 2px #5a9339" : "none")};

  svg {
    display: block;
    border-radius: 3px;
    width: ${({ $compacto }) => ($compacto ? "24px" : "36px")};
    height: ${({ $compacto }) => ($compacto ? "16px" : "24px")};
  }

  &:hover {
    background: #ecf7cf;
  }
`;
