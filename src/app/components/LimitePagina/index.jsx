import { Component } from "react";
import { useInterface } from "../../../contexts/interface/index.js";
import * as S from "./styles";

function FalhaPagina() {
  const { t } = useInterface();

  return (
    <S.Painel role="alert">
      <h1>{t("Esta aventura não abriu.")}</h1>
      <p>{t("Verifique sua conexão e tente novamente.")}</p>

      <S.Botao onClick={() => window.location.reload()}>
        {t("Tentar novamente")}
      </S.Botao>

      <S.Inicio href="#/">{t("Voltar ao início")}</S.Inicio>
    </S.Painel>
  );
}

export default class LimitePagina extends Component {
  state = { falhou: false };
  static getDerivedStateFromError() {
    return { falhou: true };
  }
  render() {
    return this.state.falhou ? <FalhaPagina /> : this.props.children;
  }
}
