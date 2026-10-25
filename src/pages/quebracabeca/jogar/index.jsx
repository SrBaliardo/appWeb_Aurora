import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import Feedback from "../../../components/Feedback/index.jsx";
import BotaoReiniciar from "../../../components/BotaoReiniciar/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import Imagem from "./components/Imagem/index.jsx";
import Montagem from "./components/Montagem/index.jsx";
import * as S from "./styles";

export default function QuebraCabeca({ nivel = "facil", alterarNivel }) {
  const { t } = useInterface();
  const partida = usePartida(nivel);

  return (
    <MolduraJogo
      titulo={t("Pedacinhos de aventura")}
      descricao={t(
        "Junte as peças e transforme uma imagem em um lindo quadro.",
      )}
      emoji="🧩"
      fundo="#f9e4ae"
      nivel={nivel}
      alterarNivel={alterarNivel}
    >
      <S.Temas role="group" aria-label={t("Tema do quebra-cabeça")}>
        {partida.temas.map((tema) => (
          <S.Tema
            key={tema.id}
            $ativo={partida.tema.id === tema.id}
            aria-pressed={partida.tema.id === tema.id}
            onClick={() => partida.escolherTema(tema.id)}
          >
            <span aria-hidden="true">{tema.emoji}</span>
            {t(tema.nome)}
          </S.Tema>
        ))}
      </S.Temas>
      <S.Cabecalho>
        <h2>{t("Qual imagem vamos montar?")}</h2>
        <span>
          {t("{total} peças", { total: partida.rodada.pecas.length })}
        </span>
      </S.Cabecalho>
      <S.Miniaturas role="group" aria-label={t("Imagens do tema")}>
        {partida.tema.imagens.map((imagem) => (
          <S.Miniatura
            key={imagem.id}
            $ativa={partida.imagem?.id === imagem.id}
            aria-pressed={partida.imagem?.id === imagem.id}
            onClick={() => partida.escolherImagem(imagem)}
          >
            <Imagem imagem={imagem} />
            <span>{t(imagem.nome)}</span>
          </S.Miniatura>
        ))}
      </S.Miniaturas>
      <S.Instrucao>
        {t(
          "Arraste uma peça até a moldura. Ou selecione a peça e depois o espaço onde ela encaixa.",
        )}
      </S.Instrucao>
      <Montagem key={partida.geracao} partida={partida} />
      <Feedback feedback={partida.feedback} />
      {partida.imagem && (
        <S.Rodape>
          <BotaoReiniciar
            variant={partida.venceu ? "contained" : "outlined"}
            onClick={partida.reiniciar}
          >
            {t("Montar novamente")}
          </BotaoReiniciar>
          <span>{t("Você também pode escolher outra imagem acima.")}</span>
        </S.Rodape>
      )}
    </MolduraJogo>
  );
}
