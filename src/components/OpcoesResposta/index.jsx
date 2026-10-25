import { useInterface } from "../../contexts/interface/index.js";
import * as S from "./styles";

export default function OpcoesResposta({
  opcoes,
  venceu,
  escolher,
  descricao = "Escolha sua resposta",
  idioma = "pt-BR",
  renderizarAcao,
}) {
  const { t } = useInterface();

  return (
    <S.Grade role="group" aria-label={t(descricao)}>
      {opcoes.map((opcao) => {
        const resposta = (
          <S.Opcao
            key={opcao.id}
            type="button"
            aria-label={opcao.descricao ? t(opcao.descricao) : undefined}
            $comAcao={Boolean(renderizarAcao)}
            $tentada={opcao.tentada}
            $correta={opcao.correta}
            disabled={venceu || opcao.tentada}
            onClick={() => escolher(opcao.id)}
          >
            <span>
              <span lang={idioma}>{opcao.texto}</span>
              {opcao.tentada ? (opcao.correta ? " ✓" : " ↺") : ""}
            </span>
          </S.Opcao>
        );

        return renderizarAcao ? (
          <S.Item key={opcao.id}>
            {resposta}
            <S.Acao>{renderizarAcao(opcao)}</S.Acao>
          </S.Item>
        ) : (
          resposta
        );
      })}
    </S.Grade>
  );
}
