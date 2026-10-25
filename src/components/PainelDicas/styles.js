import styled from "styled-components";
import Button from "@mui/material/Button";

export const Caixa = styled.aside`
  background: #fff0ba;
  border: 1px solid #efcc5d;
  border-radius: 22px;
  padding: 22px;
  align-self: start;
`;

export const Titulo = styled.h2`
  font-size: 18px;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: #785723;
`;

export const Texto = styled.p`
  color: #7e6b44;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 14px;
`;

export const Lista = styled.ol`
  padding-left: 22px;
  color: #735a31;
  font-size: 15px;
  line-height: 1.7;

  li {
    margin: 10px 0;
  }
`;

export const Botao = styled(Button)`
  && {
    background: #ffd35a;
    color: #674a1f;
    width: 100%;
    padding: 10px;
    white-space: nowrap;

    .MuiButton-startIcon {
      margin-left: 0;
      margin-right: 6px;
      flex-shrink: 0;
    }

    &:hover {
      background: #ffc534;
    }
  }
`;
