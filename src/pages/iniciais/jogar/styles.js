import styled from "styled-components";

export const Visual = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  > div {
    margin: 0;
  }
`;

export const Palavra = styled.p`
  font-size: clamp(19px, 4vw, 28px);
  font-weight: 800;
  letter-spacing: 1px;
  color: #754b91;
  margin: 0;
  overflow-wrap: anywhere;
  line-height: 1.6;
`;

export const Inicio = styled.span`
  display: inline-block;
  min-width: 32px;
  padding: 0 5px;
  margin-right: 3px;
  border-bottom: 3px solid #deab57;
  color: ${({ $venceu }) => ($venceu ? "#28743e" : "#9b70b2")};
`;
