import { useColorir } from "../../../contexts/colorir/index.js";
import { useInterface } from "../../../contexts/interface/index.js";
import { useExplorarColorir } from "./hooks/useExplorarColorir.js";
import GaleriaColorir from "./components/GaleriaColorir/index.jsx";
import EditorColorir from "./components/EditorColorir/index.jsx";
import Icone from "../../../components/Icone/index.jsx";
import BotaoBloqueado from "../../../components/BotaoBloqueado/index.jsx";
import * as S from "./styles";

export default function Colorir({
  aoAlterarPintura,
  registrarAntesDeNavegar,
} = {}) {
  const { t, idiomaInterface } = useInterface(),
    { livros, livroGratuito } = useColorir(idiomaInterface);
  const fluxo = useExplorarColorir(aoAlterarPintura);
  if (fluxo.tela === "galeria")
    return (
      <GaleriaColorir
        livro={livroGratuito}
        escolher={fluxo.escolher}
        voltar={fluxo.voltarColecao}
      />
    );
  if (fluxo.tela === "pintura")
    return (
      <EditorColorir
        key={fluxo.pagina.id}
        pagina={fluxo.pagina}
        voltar={fluxo.voltarGaleria}
        registrarAntesDeNavegar={registrarAntesDeNavegar}
      />
    );

  return (
    <>
      <S.Intro>
        <span>AURORA GOODIES</span>
        <h1 tabIndex={-1}>{t("Um bosque para colorir")}</h1>
        <p>{t("Escolha um desenho e dê suas cores às aventuras da Aurora!")}</p>
      </S.Intro>

      <S.Destaque>
        <img
          src={livroGratuito.capa}
          alt={`Aurora Goodies · ${livroGratuito.titulo}`}
        />

        <div>
          <S.Selo>{t("32 desenhos gratuitos")}</S.Selo>
          <h2 lang={livroGratuito.idioma}>{livroGratuito.titulo}</h2>
          <p>
            {t(
              "Uma aventura para pintar na tela ou imprimir e colorir em casa.",
            )}
          </p>

          <S.Acoes>
            <S.Botao onClick={fluxo.abrirLivro}>
              <Icone nome="pincel" />
              {t("Colorir gratuitamente")}
            </S.Botao>

            <S.Download href={livroGratuito.download} download>
              <Icone nome="baixar" />
              {t("Baixar para imprimir")}
            </S.Download>
          </S.Acoes>

          <S.Formato>
            {t("PDF · aproximadamente {tamanho} MB", {
              tamanho: livroGratuito.tamanhoAproximadoMB,
            })}
          </S.Formato>
        </div>
      </S.Destaque>

      <S.Subtitulo>{t("Conheça a coleção Aurora Goodies")}</S.Subtitulo>
      <S.Grade>
        {livros.map((livro) => (
          <S.Livro key={livro.id}>
            <img
              loading="lazy"
              src={livro.capa}
              alt={`Aurora Goodies · ${livro.titulo}`}
            />

            <h3 lang={livro.idioma}>{livro.titulo}</h3>
            {livro.gratuito ? (
              <S.Botao onClick={fluxo.abrirLivro}>
                {t("Vamos colorir!")}
              </S.Botao>
            ) : (
              <BotaoBloqueado
                rotulo={t("Pintura indisponível para {titulo}", {
                  titulo: livro.titulo,
                })}
              />
            )}
          </S.Livro>
        ))}
      </S.Grade>
    </>
  );
}
