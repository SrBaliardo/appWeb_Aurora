import { useEffect, useRef } from "react";
import { useInterface } from "../../../../../contexts/interface/index.js";
import Carregamento from "../../../../../components/Carregamento/index.jsx";
import Imagem from "../Imagem/index.jsx";
import { RecortePeca } from "../Peca/index.jsx";
import * as S from "./styles";

export default function Tabuleiro({ partida, arrasto }) {
  const { t, idiomaInterface } = useInterface();
  const { imagem, rodada, encaixadas, venceu, etapa, selecionada, sinal } =
    partida;
  const moldura = useRef(null);

  useEffect(() => {
    if (venceu) moldura.current?.focus({ preventScroll: true });
  }, [venceu]);

  function acionar(evento, destino) {
    if (evento.type === "keydown" && !["Enter", " "].includes(evento.key))
      return;
    evento.preventDefault();
    if (selecionada) partida.encaixar(selecionada, destino);
  }

  return (
    <S.Quadro>
      <S.Moldura
        $venceu={venceu}
        role="group"
        aria-label={t("Moldura do quebra-cabeça")}
        tabIndex={-1}
        ref={moldura}
        aria-busy={etapa === "carregando"}
      >
        {!imagem ? (
          <S.Vazio>
            <span aria-hidden="true">🧩</span>
            <p>{t("Escolha uma imagem para começar.")}</p>
          </S.Vazio>
        ) : ["previa", "carregando", "erro"].includes(etapa) || venceu ? (
          <Imagem imagem={imagem} descricao={t(imagem.nome)} />
        ) : (
          <S.Tabuleiro
            viewBox={`0 0 ${rodada.lado * 100} ${rodada.lado * 100}`}
            role="group"
            aria-label={t("Espaços para encaixar as peças")}
          >
            {rodada.pecas.map((peca) => {
              const encaixada = encaixadas.includes(peca.id);
              const resultado =
                arrasto?.alvo === peca.posicao
                  ? partida.avaliar(arrasto.id, peca.posicao)
                  : sinal?.destino === peca.posicao
                    ? sinal.resultado
                    : null;
              const cor =
                resultado === "acerto"
                  ? "#45a958"
                  : resultado === "erro"
                    ? "#dc7971"
                    : "#829d7990";
              return (
                <g
                  key={peca.id}
                  transform={`translate(${peca.coluna * 100} ${peca.linha * 100})`}
                >
                  <path
                    d={peca.caminho}
                    fill={
                      resultado === "acerto"
                        ? "#8bda9e66"
                        : resultado === "erro"
                          ? "#f0a49b55"
                          : "#fffdf399"
                    }
                    stroke={cor}
                    strokeWidth="1.4"
                    strokeDasharray={
                      resultado && resultado !== "ignorar" ? undefined : "3 3"
                    }
                    data-encaixe={peca.posicao}
                    role="button"
                    tabIndex={encaixada ? -1 : 0}
                    aria-disabled={encaixada || undefined}
                    aria-label={t(
                      "Espaço: linha {linha}, coluna {coluna}{estado}",
                      {
                        linha: peca.linha + 1,
                        coluna: peca.coluna + 1,
                        estado: encaixada ? t(", peça encaixada") : "",
                      },
                    )}
                    onClick={(evento) => acionar(evento, peca.posicao)}
                    onKeyDown={(evento) => acionar(evento, peca.posicao)}
                  />
                  {encaixada && (
                    <g pointerEvents="none">
                      <RecortePeca
                        peca={peca}
                        imagem={imagem}
                        lado={rodada.lado}
                      />
                      <path
                        d={peca.caminho}
                        fill={resultado === "acerto" ? "#79d98c33" : "none"}
                        stroke={resultado === "acerto" ? "#45a958" : "none"}
                        strokeWidth="2"
                      />
                    </g>
                  )}
                </g>
              );
            })}
          </S.Tabuleiro>
        )}
        {etapa === "carregando" && (
          <Carregamento local idioma={idiomaInterface} />
        )}
        {etapa === "erro" && (
          <S.Erro role="alert">
            <p>{t("Não foi possível carregar a imagem. Tente novamente.")}</p>
            <S.Tentar onClick={partida.reiniciar}>
              {t("Tentar novamente")}
            </S.Tentar>
          </S.Erro>
        )}
        {venceu && <S.Selo aria-hidden="true">★</S.Selo>}
      </S.Moldura>
      {venceu && (
        <S.Confetes aria-hidden="true">
          {Array.from({ length: 28 }, (_, indice) => (
            <S.Confete key={indice} $ordem={indice} />
          ))}
        </S.Confetes>
      )}
      <S.Legenda role="status">
        {venceu
          ? t("Seu quadro está pronto!")
          : etapa === "carregando"
            ? t("Preparando a imagem…")
            : etapa === "erro"
              ? t("Escolha outra imagem ou tente novamente.")
              : etapa === "previa"
                ? t("Observe a imagem…")
                : imagem
                  ? t("{feitas} de {total} peças encaixadas", {
                      feitas: encaixadas.length,
                      total: rodada.pecas.length,
                    })
                  : t("Sua próxima aventura começa aqui.")}
      </S.Legenda>
    </S.Quadro>
  );
}
