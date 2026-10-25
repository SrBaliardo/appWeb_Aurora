import Icone from "../../../../../components/Icone/index.jsx";
import * as S from "./styles";

export default function BotaoOuvir({ opcao, voz }) {
  const ativo = voz.textoAtivo === opcao.texto;
  const rotulo = `Ouvir ${opcao.texto.toLocaleLowerCase("pt-BR")}`;

  return (
    <S.Botao
      type="button"
      disabled={!voz.disponivel}
      $ativo={ativo}
      aria-label={rotulo}
      aria-busy={ativo}
      title={voz.disponivel ? rotulo : "Áudio indisponível neste navegador"}
      onClick={() => voz.falar(opcao)}
    >
      <Icone nome="audio" tamanho={18} />
    </S.Botao>
  );
}
