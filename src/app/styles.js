import styled from "styled-components";

export const Layout = styled.div`
  min-height: ${({ $pintando }) => ($pintando ? "100dvh" : "100vh")};
  display: flex;
  flex-direction: column;
`;

export const Conteudo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  ${({ $pintando }) =>
    $pintando && "height: 100dvh; max-height: 100dvh; overflow: hidden;"};
`;

export const Erro = styled.p`
  padding: 14px;
  background: #fff0ce;
  color: #755426;
  border-radius: 14px;
`;

export const Pular = styled.a`
  position: fixed;
  top: -100px;
  left: 15px;
  background: #fff;
  padding: 15px;
  z-index: 100;

  &:focus {
    top: 12px;
  }
`;

export const Cabecalho = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  flex-shrink: 0;
  overflow-x: clip;
  border-bottom: 1px solid #eaeadd;
  background: #fffdf7;
`;

export const Barra = styled.div`
  max-width: 1160px;
  min-height: 94px;
  margin: 0 auto;
  padding: 14px 24px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px 20px;

  @media (max-width: 450px) {
    padding: 14px 16px 8px;
    gap: 12px 8px;
  }

  @media (max-height: 520px) {
    ${({ $pintando }) =>
      $pintando &&
      "min-height: 0; padding: 6px 16px; gap: 4px 12px; > a > span { width: 28px; height: 28px; svg { width: 20px; height: 20px; } } > a > div > strong { font-size: 20px; } > a > div > span { font-size: 8px; margin-bottom: 1px; }"}
  }
`;

export const Marca = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  width: fit-content;

  @media (max-width: 450px) {
    gap: 8px;
  }
`;

export const Emblema = styled.span`
  width: 47px;
  height: 49px;
  border-radius: 17px 17px 19px 19px;
  background: #2d7457;
  display: grid;
  place-items: center;
  color: #fff3bd;
  transform: rotate(-6deg);

  svg {
    width: 29px;
    height: 29px;
  }

  @media (max-width: 450px) {
    width: 34px;
    height: 38px;
    border-radius: 12px;

    svg {
      width: 23px;
      height: 23px;
    }
  }
`;

export const Nome = styled.div`
  line-height: 1.1;

  > span {
    font-size: 11px;
    letter-spacing: 2.1px;
    display: block;
    color: #7f8b70;
    font-weight: 800;
    margin-bottom: 3px;
  }

  > strong {
    font-size: 27px;
    color: #315c45;
    letter-spacing: -1px;
  }

  @media (max-width: 450px) {
    > span {
      font-size: 8px;
      letter-spacing: 1px;
    }

    > strong {
      font-size: 22px;
    }
  }
`;

export const Link = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 44px;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  color: ${({ $ativo }) => ($ativo ? "#216638" : "#64705e")};
  background: ${({ $ativo }) => ($ativo ? "#dcf2ad" : "transparent")};

  &:hover {
    background: #edf7cf;
    color: #315b44;
  }

  @media (max-width: 450px) {
    padding: 9px 11px;
    font-size: 12px;
    gap: 5px;
  }
`;

export const Principal = styled.main`
  position: relative;
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
  flex: 1;
  ${({ $pintando }) =>
    $pintando &&
    "display: flex; flex-direction: column; min-height: 0;"} @media(max-width:450px) {
    padding: 0 16px;
  }
`;

export const Rodape = styled.footer`
  ${({ $pintando }) => $pintando && "display: none;"}
  border-top: 1px solid #e7e7db;
  padding: 25px 24px;
  color: #7d8774;
  font-size: 12px;

  > div {
    max-width: 1112px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
  }

  span {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  @media (max-width: 600px) {
    > div {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
  }
`;

export const Creditos = styled.footer`
  display: ${({ $pintando }) => ($pintando ? "none" : "block")};
  flex-shrink: 0;
  border-top: 1px solid #e7e7db;
  padding: 13px 24px;
  background: #f7f6eb;
  color: #63715e;
`;

export const LinhaCreditos = styled.div`
  max-width: 1112px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 5px 8px;
  font-size: 11px;
  line-height: 1.7;
  text-align: center;
`;

export const Empresa = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  color: #405143;
`;

export const LogoEmpresa = styled.img`
  display: block;
  width: 16px;
  height: 19px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const Hivetron = styled.span`
  font-family: "Goldman", "Trebuchet MS", sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.35px;
`;

export const Technology = styled.span`
  font-family: "KyivType Sans", "Segoe UI", sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.7px;
`;
