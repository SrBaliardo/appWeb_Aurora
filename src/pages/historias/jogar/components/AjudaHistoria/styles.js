import styled, { css, keyframes } from "styled-components";
import Dialog from "@mui/material/Dialog";

const entrar = keyframes`from { opacity: .3; } to { opacity: 1; }`;

export const Abrir = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 11px 19px;
  border-radius: 17px;
  margin: 0 auto 22px;
  background: #fff0bf;
  border: 2px solid #e8cb78;
  color: #735520;
  font-weight: 800;
  box-shadow: 0 4px 0 #e2c57966;

  &:hover {
    background: #ffe69e;
  }
`;

export const Dialogo = styled(Dialog)`
  .MuiBackdrop-root {
    background: rgba(8, 43, 30, 0.48);
    backdrop-filter: blur(3px);
  }

  .MuiDialog-paper {
    width: min(740px, calc(100% - 24px));
    max-height: calc(100dvh - 24px);
    margin: 12px;
    border-radius: 25px;
    background: #fffbed;
    overflow-y: auto;
  }
`;

export const Cabecalho = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 18px 22px;
  border-bottom: 1px solid #e9e3be;

  h2 {
    font-size: clamp(18px, 3vw, 24px);
    margin: 5px 0 0;
  }

  small {
    font-size: 12px;
    font-weight: 700;
    color: #798752;
  }
`;

export const Fechar = styled.button`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border: 0;
  border-radius: 50%;
  background: #eaf2d6;
  color: #3b6447;
  font-size: 28px;
`;

export const Pagina = styled.div`
  animation: ${entrar} 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Ilustracao = styled.div`
  padding: 18px 22px 0;

  svg {
    display: block;
    width: 100%;
    max-height: 300px;
    border-radius: 20px;
  }
`;

export const Texto = styled.div`
  text-align: center;
  padding: 16px 26px 22px;

  small {
    color: #8b763d;
    font-size: 11px;
    letter-spacing: 0.6px;
    font-weight: 800;
  }

  h3 {
    font-size: clamp(20px, 3vw, 25px);
    line-height: 1.4;
    margin: 9px 0 12px;
    color: #3b6542;
  }

  p {
    color: #647456;
    font-size: clamp(15px, 2.5vw, 18px);
    line-height: 1.7;
    margin: 0;
  }
`;

export const Rodape = styled.div`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px 20px 18px;
  border-top: 1px solid #e9e3be;
  background: #fffbed;

  @media (max-width: 480px) {
    ${({ $ultima }) =>
      $ultima &&
      css`
        grid-template-columns: 44px minmax(0, 1fr);
        > span {
          grid-column: 1 / -1;
          grid-row: 1;
        }
        > button {
          grid-row: 2;
        }
      `}
  }
`;

export const Botao = styled.button`
  min-height: 44px;
  padding: 9px 14px;
  border-radius: 13px;
  border: 1px solid #ccdbab;
  background: #edf4d9;
  color: #3b6447;
  font-weight: 700;
`;

export const Contador = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #73825b;
  text-align: center;
`;

export const Seta = styled(Botao)`
  display: grid;
  place-items: center;
  min-width: 44px;
  padding: 10px;

  &:disabled {
    opacity: 0.45;
  }
`;

export const Concluir = styled(Botao)`
  justify-self: end;
  white-space: nowrap;
  background: #21834b;
  color: #fffdf1;
  border-color: #21834b;

  @media (max-width: 480px) {
    padding: 9px 12px;
    font-size: 14px;
  }
`;
