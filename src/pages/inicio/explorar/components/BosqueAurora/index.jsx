import { useInterface } from "../../../../../contexts/interface/index.js";
import * as S from "./styles";

export default function BosqueAurora() {
  const { t } = useInterface();

  return (
    <S.Ilustracao
      src="/images/aurora-turma-bosque.jpg"
      width={1536}
      height={1024}
      alt={t(
        "Aurora de vestido lilás e sua amiga capivara de mochila verde, com a turma em um bosque florido",
      )}
      loading="eager"
      decoding="async"
    />
  );
}
