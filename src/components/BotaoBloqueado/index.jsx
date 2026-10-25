import Icone from "../Icone/index.jsx";
import * as S from "./styles";

export default function BotaoBloqueado({ rotulo }) {
  return (
    <S.Botao
      type="button"
      aria-disabled="true"
      aria-label={rotulo}
      title={rotulo}
    >
      <Icone nome="cadeado" tamanho={23} />
    </S.Botao>
  );
}
