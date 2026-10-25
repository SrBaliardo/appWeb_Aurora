import styled from "styled-components";
import Button from "@mui/material/Button";

export const Titulo = styled.h2`
  font-size: 23px;
  text-align: center;
  margin: 0 0 14px;
`;

export const Instrucao = styled.p`
  line-height: 1.7;
  text-align: center;
  color: #68735e;
  margin: 0 auto 20px;
  max-width: 650px;
  font-size: 14px;
`;

export const Conferir = styled(Button)`
  && {
    display: flex;
    margin: 0 auto 20px;
    border-radius: 14px;
  }
`;

export const Rodape = styled.div`
  text-align: center;
  margin-top: 24px;
`;
