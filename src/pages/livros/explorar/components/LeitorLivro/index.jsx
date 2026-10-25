import { useInterface } from "../../../../../contexts/interface/index.js";
import Icone from "../../../../../components/Icone/index.jsx";
import Carregamento from "../../../../../components/Carregamento/index.jsx";
import * as S from "./styles";

export default function LeitorLivro({ livro, leitura }) {
  const { t, idiomaInterface } = useInterface();
  const {
    aberto,
    fechar,
    pagina,
    mudarPagina,
    zoom,
    alternarZoom,
    fonte,
    chave,
    status,
    carregou,
    falhou,
    tentar,
  } = leitura;

  return (
    <S.Dialogo
      open={aberto}
      maxWidth={false}
      onClose={(_evento, motivo) => {
        if (motivo === "escapeKeyDown") fechar();
      }}
      aria-labelledby="titulo-leitura"
      onKeyDown={(evento) => {
        if (evento.target.matches?.('input[type="range"]')) return;
        if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
        if (evento.key === "ArrowRight" || evento.key === "ArrowLeft") {
          evento.preventDefault();
          mudarPagina(pagina + (evento.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <S.Cabecalho>
        <div>
          <h2 id="titulo-leitura" lang={livro.idioma}>
            {livro.titulo}
          </h2>
          <small>{t(livro.legendaIdioma)}</small>
        </div>
        <S.Botao onClick={fechar}>{t("Fechar leitura")} ×</S.Botao>
      </S.Cabecalho>
      <S.Area>
        <S.Setinha
          onClick={() => mudarPagina(pagina - 1)}
          disabled={pagina === 1}
          aria-label={t("Página anterior")}
        >
          <Icone nome="voltar" />
        </S.Setinha>
        <S.Painel aria-busy={status === "carregando"}>
          <S.Rolagem
            data-rolagem-bosque=""
            key={pagina}
            tabIndex={0}
            aria-label={t("Página do livro. Use o zoom para ampliar.")}
          >
            <S.Pagina
              key={chave}
              $zoom={zoom}
              src={fonte}
              alt={t("Página {pagina} de {total}", {
                pagina,
                total: livro.paginas.length,
              })}
              onLoad={carregou}
              onError={falhou}
            />
          </S.Rolagem>
          {status === "carregando" && (
            <Carregamento local idioma={idiomaInterface} />
          )}
          {status === "erro" && (
            <S.Erro role="alert">
              <p>{t("Não foi possível carregar esta página.")}</p>
              <S.Botao onClick={tentar}>{t("Tentar novamente")}</S.Botao>
            </S.Erro>
          )}
        </S.Painel>
        <S.Setinha
          onClick={() => mudarPagina(pagina + 1)}
          disabled={pagina === livro.paginas.length}
          aria-label={t("Próxima página")}
        >
          <Icone nome="seta" />
        </S.Setinha>
      </S.Area>
      <S.Rodape>
        <span role="status">
          {t("Página {pagina} de {total}", {
            pagina,
            total: livro.paginas.length,
          })}
        </span>
        <S.Botao
          onClick={alternarZoom}
          aria-label={t("Ampliar página. Zoom atual: {zoom}%", { zoom })}
        >
          Zoom {zoom}% ＋
        </S.Botao>
      </S.Rodape>
    </S.Dialogo>
  );
}
