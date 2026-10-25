import { useInterface } from "../../../../../contexts/interface/index.js";
import Icone from "../../../../../components/Icone/index.jsx";
import { useCinemaHistoria } from "../../hooks/useCinemaHistoria.js";
import IlustracaoHistoria from "../IlustracaoHistoria/index.jsx";
import * as S from "./styles";

export default function AjudaHistoria({ rodada }) {
  const { t } = useInterface();
  const cinema = useCinemaHistoria(rodada.slides.length);
  const slide = rodada.slides[cinema.indice];
  const ultima = cinema.indice === rodada.slides.length - 1;
  return (
    <>
      <S.Abrir type="button" onClick={cinema.abrir}>
        <Icone nome="claquete" />
        {t("Ver a história")}
      </S.Abrir>
      {cinema.aberto && (
        <S.Dialogo
          open
          maxWidth={false}
          onClose={cinema.fechar}
          aria-labelledby="titulo-dica-historia"
          onKeyDown={(evento) => {
            if (evento.target.matches?.('input[type="range"]')) return;
            if (evento.ctrlKey || evento.altKey || evento.metaKey) return;
            if (evento.key === "ArrowLeft") {
              evento.preventDefault();
              cinema.anterior();
            }
            if (evento.key === "ArrowRight") {
              evento.preventDefault();
              cinema.proxima();
            }
          }}
        >
          <S.Cabecalho>
            <div>
              <small>{t("Uma dica em forma de história")}</small>
              <h2 id="titulo-dica-historia">{t(rodada.titulo)}</h2>
            </div>
            <S.Fechar
              type="button"
              onClick={cinema.fechar}
              aria-label={t("Fechar história")}
            >
              ×
            </S.Fechar>
          </S.Cabecalho>
          <S.Pagina key={slide.id} aria-live="polite" aria-atomic="true">
            <S.Ilustracao>
              <IlustracaoHistoria historiaId={rodada.id} slide={slide} />
            </S.Ilustracao>
            <S.Texto>
              <small>
                {t(
                  slide.capa
                    ? "Capa da história"
                    : ultima
                      ? "Fim da história"
                      : "Continue a aventura",
                )}
              </small>
              <h3>{t(slide.texto)}</h3>
              <p>{t(slide.narracao)}</p>
            </S.Texto>
          </S.Pagina>
          <S.Rodape $ultima={ultima}>
            <S.Seta
              type="button"
              disabled={cinema.indice === 0}
              onClick={cinema.anterior}
              aria-label={t("Página anterior")}
            >
              <Icone nome="voltar" />
            </S.Seta>
            <S.Contador role="status">
              {t("Página {pagina} de {total}", {
                pagina: cinema.indice + 1,
                total: rodada.slides.length,
              })}
            </S.Contador>
            {ultima ? (
              <S.Concluir type="button" onClick={cinema.fechar}>
                {t("Vamos organizar!")}
              </S.Concluir>
            ) : (
              <S.Seta
                type="button"
                onClick={cinema.proxima}
                aria-label={t("Próxima página")}
              >
                <Icone nome="seta" />
              </S.Seta>
            )}
          </S.Rodape>
        </S.Dialogo>
      )}
    </>
  );
}
