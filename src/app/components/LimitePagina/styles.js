import styled from "styled-components";
import Button from "@mui/material/Button";

export const Painel = styled.section`
  margin: 30px 0;
  padding: 28px;
  border-radius: 24px;
  background: #edf6d4;
  text-align: center;

  h1 {
    color: #315c45;
  }

  p {
    line-height: 1.6;
  }
`;

export const Botao = styled(Button).attrs({ variant: "contained" })`
  min-height: 44px;
  margin: 8px;
`;

export const Inicio = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 10px;
`;
