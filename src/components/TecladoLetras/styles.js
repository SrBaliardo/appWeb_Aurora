import styled from "styled-components";

export const Teclado = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 650px;
  margin: 22px auto 14px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const Tecla = styled.button`
  min-width: 44px;
  width: 48px;
  height: 49px;
  padding: 0;
  border-radius: 12px;
  font-weight: 800;
  font-size: 20px;
  border: 1px solid #dedfd3;
  color: #365a49;
  background: #fff;
  box-shadow: 0 3px 0 #e4e7db;
  transition:
    transform 0.15s,
    background 0.15s;

  &:hover:not(:disabled) {
    background: #fff0bb;
    transform: translateY(-2px);
  }

  &:disabled {
    background: ${({ $correta }) => ($correta ? "#d8f3a5" : "#f1efeb")};
    color: ${({ $correta }) => ($correta ? "#27672c" : "#807e77")};
    box-shadow: none;
    transform: translateY(2px);
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 46px;
    font-size: 18px;
  }
`;

export const Nota = styled.p`
  font-size: 13px;
  color: #6b7b6e;
  text-align: center;
  margin: 14px 0 0;
`;
