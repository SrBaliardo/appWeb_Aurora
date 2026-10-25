import styled from "styled-components";

export const Enquadramento = styled.section`
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  background: #fffbed;
`;

export const Editor = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;

  > header,
  > p,
  > [role="status"],
  > [role="alert"] {
    flex-shrink: 0;
  }

  @media (max-height: 650px), (max-width: 600px) {
    padding: 8px 0;
    gap: 5px;
  }
`;

export const Botao = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 8px 14px;
  border: 2px solid #c2d992;
  border-radius: 13px;
  background: #fffdf2;
  color: #285c36;
  font-weight: 800;
  white-space: nowrap;
  transition:
    transform 0.15s,
    background 0.15s;

  &:hover:not(:disabled) {
    background: #edf7d6;
    transform: translateY(-2px);
  }

  &[aria-pressed="true"] {
    background: #d8efac;
    border-color: #2a8549;
  }

  &:disabled {
    opacity: 0.5;
  }

  @media (max-width: 600px) {
    padding: 8px;
    font-size: 13px;
    gap: 5px;
  }
`;

export const BotaoIcone = styled(Botao)`
  width: 44px;
  min-width: 44px;
  padding: 6px;
  flex: 0 0 44px;
`;

export const AcaoTitulo = styled.button`
  display: grid;
  place-items: center;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $acao }) =>
    $acao === "cancelar"
      ? "#c4453c"
      : $acao === "confirmar"
        ? "#218548"
        : "#d47716"};

  svg {
    stroke-width: 2.6;
  }

  &:hover:not(:disabled) svg {
    transform: scale(1.08);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export const Voltar = styled(Botao)`
  @media (max-width: 600px) {
    width: 44px;
    flex: 0 0 44px;
    span {
      display: none;
    }
  }
`;

export const Cabecalho = styled.header`
  display: flex;
  min-width: 0;
  gap: 18px;
  align-items: center;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

export const Titulo = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
  gap: 8px;
  font-size: clamp(19px, 3vw, 30px);
  font-weight: 800;

  h1 {
    font: inherit;
    height: 44px;
    line-height: 44px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    padding: 0;
  }
`;

export const Edicao = styled.form`
  display: flex;
  flex: 0 1 auto;
  min-width: 0;
  height: 44px;
  margin: 0;
  padding: 0;
  gap: 6px;
  align-items: center;
  max-width: 100%;
`;

export const Campo = styled.input`
  appearance: none;
  min-width: 0;
  width: ${({ $largura }) => $largura || 215}px;
  max-width: 450px;
  flex: 0 1 auto;
  height: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  outline: none;
  box-shadow: none;
  background: transparent;
  font: inherit;
  line-height: 44px;
  color: inherit;

  &[aria-invalid="true"] {
    color: #b94432;
  }

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

export const Instrucao = styled.p`
  display: ${({ $oculta }) => ($oculta ? "none" : "block")};
  font-size: 13px;
  line-height: 18px;
  margin: 0;
  color: #577048;

  @media (max-height: 650px) {
    display: none;
  }
`;

export const Area = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 6px;
  }

  @media (max-height: 520px) and (min-width: 601px) {
    grid-template-columns: minmax(0, 1fr) 388px;
    gap: 8px;
  }

  @media (max-height: 520px) and (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr) 124px;
    grid-template-rows: minmax(0, 1fr);
  }
`;

export const Desenho = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  min-width: 0;
  min-height: 0;
  gap: 6px;
`;

export const Palco = styled.div`
  display: grid;
  place-items: center;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
`;

export const Papel = styled.div`
  box-sizing: content-box;
  width: ${({ $largura }) => ($largura > 0 ? `${$largura}px` : "0px")};
  max-width: calc(100% - 16px);
  padding: 4px;
  border: 4px solid #e3b969;
  border-radius: 16px;
  background: #fffdf4;
  overflow: hidden;
`;

export const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: auto;
  background: white;
  touch-action: none;
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='12' fill='none' stroke='white' stroke-width='3'/%3E%3Ccircle cx='16' cy='16' r='12' fill='none' stroke='%23304c38' stroke-width='1.5'/%3E%3C/svg%3E")
      16 16,
    auto;
`;

export const Acoes = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 10px;

  @media (max-width: 600px) {
    gap: 6px;
  }

  @media (max-width: 450px) {
    button {
      font-size: 12px;
      padding: 6px;
      gap: 4px;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-height: 520px) and (min-width: 601px) {
    button {
      font-size: 0;
      gap: 0;
      padding: 8px;
      min-width: 44px;
    }
  }
`;

export const Painel = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  gap: 24px;
  background: #e8f5c9;
  padding: 10px;
  border: 1px solid #bed58d;
  border-radius: 20px;
  min-height: 0;

  @media (max-height: 700px) {
    gap: 16px;
  }

  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 8px;
    padding: 6px;
  }

  @media (max-height: 520px) and (min-width: 601px) {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 44px minmax(0, 1fr);
    align-items: center;
    padding: 3px;
    gap: 4px;
  }

  @media (max-height: 520px) and (max-width: 600px) {
    display: flex;
    align-items: stretch;
    padding: 4px;
    gap: 4px;
    overflow: hidden;
  }
`;

export const Ferramentas = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: nowrap;

  @media (max-width: 600px) {
    justify-content: flex-start;
  }

  @media (max-height: 520px) {
    grid-column: 1;
    grid-row: 1;
    justify-content: center;
    gap: 8px;
    flex-shrink: 0;
  }
`;

export const Paleta = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 44px);
  justify-content: center;
  gap: 14px 8px;

  @media (max-height: 700px) {
    row-gap: 10px;
  }

  @media (max-width: 600px) {
    grid-column: 1 / -1;
    grid-row: 2;
    grid-template-columns: repeat(auto-fit, minmax(44px, 1fr));
    justify-items: center;
    gap: 6px;
  }

  @media (max-height: 520px) and (min-width: 601px) {
    grid-column: 1 / -1;
    grid-row: 2;
    grid-template-columns: repeat(auto-fit, minmax(44px, 1fr));
    grid-auto-rows: 44px;
    min-height: 0;
    max-height: 100%;
    overflow-y: auto;
    align-content: start;
    justify-items: center;
    gap: 4px;
  }

  @media (max-height: 520px) and (max-width: 600px) {
    flex: 1;
    min-height: 0;
    grid-template-columns: repeat(2, 44px);
    grid-auto-rows: 44px;
    overflow-y: auto;
    align-content: start;
  }

  &[data-rolagem-bosque-y] {
    grid-template-columns: repeat(auto-fit, minmax(44px, 1fr));
  }
`;

export const Cor = styled.button`
  width: 44px;
  height: 44px;
  background: ${({ $cor }) => $cor};
  color: ${({ $cor }) =>
    ["#353b42", "#755347", "#497be8", "#9365cf"].includes($cor)
      ? "white"
      : "#173c29"};
  font-weight: 900;
  font-size: 23px;
  border: 3px solid ${({ $ativa }) => ($ativa ? "#27512c" : "#ffffff")};
  border-radius: 50%;
  box-shadow: 0 2px 0 #49652d55;
`;

export const Desfazer = styled(Botao)`
  @media (max-width: 600px), (max-height: 520px) {
    grid-column: 2;
    grid-row: 1;
    width: 44px;
    padding: 6px;
    flex-shrink: 0;
    align-self: center;

    span {
      display: none;
    }
  }
`;

export const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 18px;
  font-size: 12px;
  line-height: 18px;
  color: #286f3a;

  button {
    flex-shrink: 0;
  }
`;

export const Mensagem = styled.span`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Confirmacao = styled.div`
  padding: 26px;
  max-width: 470px;
  background: #fffbea;

  p {
    line-height: 1.6;
  }

  button {
    margin: 5px;
  }
`;
