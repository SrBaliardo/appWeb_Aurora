import { useLivros } from "../../../contexts/livros/index.js";
import { useInterface } from "../../../contexts/interface/index.js";
import { useLeitura } from "./hooks/useLeitura.js";
import LeitorLivro from "./components/LeitorLivro/index.jsx";
import Icone from "../../../components/Icone/index.jsx";
import BotaoBloqueado from "../../../components/BotaoBloqueado/index.jsx";
import * as S from "./styles";

export default function Livros() {
  const { t, idiomaInterface } = useInterface();
  const { livros, livroGratuito, limitarPagina } = useLivros(idiomaInterface);
  const leitura = useLeitura(livroGratuito, limitarPagina);

  return (
    <>
      <S.Intro>
        <span>{t("LEIA, IMAGINE E DESCUBRA")}</span>
        <h1 tabIndex={-1}>{t("Uma coleção de aventuras")}</h1>
        <p>
          {t(
            "Leia uma história grátis e conheça a coleção da Aurora e sua turma.",
          )}
        </p>
        <small>{t(livroGratuito.legendaIdioma)}</small>
      </S.Intro>
      <S.Destaque>
        <img src={livroGratuito.capa} alt={livroGratuito.titulo} />
        <div>
          <S.Selo>{t("Leitura gratuita")}</S.Selo>
          <h2 lang={livroGratuito.idioma}>{livroGratuito.titulo}</h2>
          <p>
            {t(
              "Uma aventura inteira para ler, imaginar e compartilhar em família.",
            )}
          </p>
          <S.Acoes>
            <S.Botao
              variant="contained"
              onClick={leitura.abrir}
              startIcon={<Icone nome="livro" />}
            >
              {t("Ler agora")}
            </S.Botao>
            <S.Download href={livroGratuito.download} download>
              <Icone nome="baixar" />
              {t("Baixar")}
            </S.Download>
          </S.Acoes>
          <S.Formato>
            {t("PDF · aproximadamente {tamanho} MB", {
              tamanho: livroGratuito.tamanhoAproximadoMB,
            })}
          </S.Formato>
        </div>
      </S.Destaque>
      <S.Subtitulo>{t("Conheça a coleção")}</S.Subtitulo>
      <S.Grade>
        {livros.map((livro) => (
          <S.Livro key={livro.id}>
            <img loading="lazy" src={livro.capa} alt={livro.titulo} />
            <h3 lang={livro.idioma}>{livro.titulo}</h3>
            {livro.gratuito ? (
              <S.Botao variant="contained" onClick={leitura.abrir}>
                {t("Vamos ler")}
              </S.Botao>
            ) : (
              <BotaoBloqueado
                rotulo={t("Leitura indisponível para {titulo}", {
                  titulo: livro.titulo,
                })}
              />
            )}
          </S.Livro>
        ))}
      </S.Grade>
      {leitura.aberto && (
        <LeitorLivro livro={livroGratuito} leitura={leitura} />
      )}
    </>
  );
}
