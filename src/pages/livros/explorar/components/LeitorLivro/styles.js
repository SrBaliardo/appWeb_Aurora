import styled, { keyframes } from "styled-components";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";

const revelar = keyframes`from { opacity: .35; } to { opacity: 1; }`;

export const Dialogo = styled(Dialog)`
  .MuiBackdrop-root {
    background: rgba(8, 43, 30, 0.65);
    backdrop-filter: blur(4px);
  }

  .MuiDialog-paper {
    width: min(1200px, calc(100% - 24px));
    max-height: calc(100dvh - 24px);
    margin: 12px;
    padding: 16px;
    border-radius: 24px;
    background: #fffbea;
    overflow: hidden;
  }

  @media (max-width: 600px) {
    .MuiDialog-paper {
      padding: 10px;
      border-radius: 18px;
    }
  }
`;

export const Cabecalho = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  h2 {
    font-size: clamp(15px, 2.2vw, 21px);
    margin: 0 0 3px;
  }

  small {
    color: #657959;
  }
`;

export const Botao = styled(Button)`
  && {
    min-height: 44px;
    flex-shrink: 0;
    border-radius: 14px;
    color: #245c35;
    background: #e5f3c8;
    padding: 8px 13px;

    &:hover {
      background: #d5ecaa;
    }
  }
`;

export const Area = styled.div`
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 48px;
  gap: 10px;
  align-items: center;
  min-height: 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    > :nth-child(2) {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    > :first-child {
      justify-self: start;
    }

    > :last-child {
      justify-self: end;
    }
  }
`;

export const Setinha = styled(Botao)`
  && {
    min-width: 48px;
    padding: 12px;
    background: #ffd265;
    color: #643c10;

    &:hover {
      background: #ffc64b;
    }
  }
`;

export const Painel = styled.div`
  position: relative;
  min-width: 0;
  min-height: 100px;
  overflow: hidden;
  border-radius: 12px;
  background: #e7eacb;
`;

export const Rolagem = styled.div`
  overflow: auto;
  height: min(65dvh, 650px, calc(100dvh - 175px));
  display: flex;
  align-items: safe center;
  touch-action: pan-x pan-y pinch-zoom;

  @media (max-width: 600px) {
    height: min(56dvh, 520px, calc(100dvh - 245px));
  }
`;

export const Pagina = styled.img`
  display: block;
  flex: 0 0 auto;
  width: ${({ $zoom }) => $zoom}%;
  max-width: none;
  height: ${({ $zoom }) => ($zoom === 100 ? "100%" : "auto")};
  object-fit: contain;
  animation: ${revelar} 0.25s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Erro = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  background: #fffbea;
`;

export const Rodape = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 700;
`;
