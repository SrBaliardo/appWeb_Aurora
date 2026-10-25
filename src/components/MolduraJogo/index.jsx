import { useInterface } from "../../contexts/interface/index.js";
import Icone from "../Icone/index.jsx";
import SeletorNivel from "../SeletorNivel/index.jsx";
import SeletorIdioma from "../SeletorIdioma/index.jsx";
import * as S from "./styles";

export default function MolduraJogo({
  titulo,
  descricao,
  emoji,
  fundo,
  children,
  nivel,
  alterarNivel,
  idioma = "pt-BR",
  alterarIdioma,
}) {
  const { t } = useInterface();

  return (
    <S.Area>
      <S.Voltar href="#/">
        <Icone nome="voltar" tamanho={18} /> {t("Voltar para o bosque")}
      </S.Voltar>

      <S.Cabecalho>
        <S.Emblema $fundo={fundo} aria-hidden="true">
          {emoji}
        </S.Emblema>

        <div>
          <S.Titulo tabIndex={-1}>{titulo}</S.Titulo>
          <S.Descricao>{descricao}</S.Descricao>
        </div>
      </S.Cabecalho>

      {(alterarNivel || alterarIdioma) && (
        <S.Preferencias>
          {alterarIdioma && (
            <SeletorIdioma idioma={idioma} alterar={alterarIdioma} />
          )}

          {alterarNivel && (
            <SeletorNivel nivel={nivel} alterar={alterarNivel} />
          )}
        </S.Preferencias>
      )}

      <S.Painel>{children}</S.Painel>
    </S.Area>
  );
}
