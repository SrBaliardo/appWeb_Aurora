import { useInterface } from "../contexts/interface/index.js";
import { useState, Suspense } from "react";
import Inicio from "../pages/inicio/explorar/index.jsx";
import LimitePagina from "./components/LimitePagina/index.jsx";
import MenuBosque from "./components/MenuBosque/index.jsx";
import { paginas } from "./paginas.js";
import Icone from "../components/Icone/index.jsx";
import SeletorIdioma from "../components/SeletorIdioma/index.jsx";
import Carregamento from "../components/Carregamento/index.jsx";
import { useNavegacao } from "./hooks/useNavegacao.js";
import * as S from "./styles";

const links = [
  ["inicio", "Início", "casa"],
  ["livros", "Livros", "livro"],
  ["colorir", "Colorir", "cores"],
  ["forca", "Forca", "folha"],
  ["palavras", "Palavrinhas", "letras"],
  ["memoria", "Memória", "memoria"],
  ["quebracabeca", "Quebra-cabeça", "quebracabeca"],
  ["cores", "Cores", "cores"],
  ["descobertas", "Descobertas", "estrela"],
  ["matematica", "Continhas", "estrela"],
  ["escrita", "Escrita", "letras"],
  ["sequencias", "Sequências", "estrela"],
  ["contagem", "Contar", "estrela"],
  ["classificacao", "Coleções", "estrela"],
  ["iniciais", "Iniciais", "letras"],
  ["historias", "Histórias", "livro"],
];

export default function App() {
  const {
    t,
    idiomaInterface,
    idiomaDestino,
    trocarIdiomaInterface,
    idiomaDoJogo,
    trocarIdiomaDoJogo,
    carregando,
    erro,
  } = useInterface();
  const {
    pagina,
    pularConteudo,
    registrarAntesDeNavegar,
    interceptarNavegacao,
  } = useNavegacao();
  const [niveis, setNiveis] = useState({});
  const [pintando, setPintando] = useState(false);
  const modoPintura = pagina === "colorir" && pintando;
  const nivel = niveis[pagina] || "facil";
  const idioma = idiomaDoJogo(pagina);
  const Pagina = pagina === "inicio" ? Inicio : paginas[pagina];

  return (
    <S.Layout $pintando={modoPintura}>
      <S.Conteudo
        $pintando={modoPintura}
        inert={carregando ? "" : undefined}
        aria-hidden={carregando || undefined}
      >
        <S.Pular href="#conteudo" onClick={pularConteudo}>
          {t("Pular para o conteúdo")}
        </S.Pular>

        <S.Cabecalho
          data-cabecalho-bosque=""
          onClickCapture={interceptarNavegacao}
        >
          <S.Barra $pintando={modoPintura}>
            <S.Marca href="#/" aria-label={t("Aventuras da Aurora, início")}>
              <S.Emblema>
                <Icone nome="folha" />
              </S.Emblema>

              <S.Nome>
                <span>AVENTURAS DA</span>
                <strong>Aurora</strong>
              </S.Nome>
            </S.Marca>

            <SeletorIdioma
              compacto
              idioma={carregando ? idiomaDestino : idiomaInterface}
              alterar={trocarIdiomaInterface}
              desabilitado={carregando}
            />

            <MenuBosque>
              {links.map(([id, nome, icone]) => (
                <S.Link
                  key={id}
                  href={id === "inicio" ? "#/" : `#/${id}`}
                  $ativo={pagina === id}
                  aria-current={pagina === id ? "page" : undefined}
                >
                  <Icone nome={icone} tamanho={18} />
                  {t(nome)}
                </S.Link>
              ))}
            </MenuBosque>
          </S.Barra>
        </S.Cabecalho>

        <S.Principal
          $pintando={modoPintura}
          id="conteudo"
          tabIndex={-1}
          aria-busy={carregando}
        >
          {erro && <S.Erro role="alert">{t(erro)}</S.Erro>}

          <LimitePagina key={pagina}>
            <Suspense
              fallback={<Carregamento local idioma={idiomaInterface} />}
            >
              <Pagina
                key={
                  pagina === "colorir"
                    ? "colorir"
                    : `${pagina}-${nivel}-${idioma}`
                }
                idioma={idioma}
                alterarIdioma={(novoIdioma) =>
                  trocarIdiomaDoJogo(pagina, novoIdioma)
                }
                nivel={nivel}
                alterarNivel={(novoNivel) =>
                  setNiveis((atuais) => ({ ...atuais, [pagina]: novoNivel }))
                }
                aoAlterarPintura={setPintando}
                registrarAntesDeNavegar={registrarAntesDeNavegar}
              />
            </Suspense>
          </LimitePagina>
        </S.Principal>

        <S.Rodape $pintando={modoPintura}>
          <div>
            <span>
              <Icone nome="folha" tamanho={16} />{" "}
              {t("Aventuras da Aurora · Um bosque de descobertas.")}
            </span>

            <span>
              {t("Feito com carinho para pequenos curiosos")}{" "}
              <Icone nome="coracao" tamanho={14} />
            </span>
          </div>
        </S.Rodape>

        <S.Creditos
          $pintando={modoPintura}
          aria-label={t("Créditos da plataforma")}
        >
          <S.LinhaCreditos>
            <span>© 2026 — {t("Desenvolvido por")}</span>{" "}
            <S.Empresa translate="no" lang="en">
              <S.LogoEmpresa
                src="/images/logo-hivetron.png"
                alt=""
                width="16"
                height="19"
                loading="lazy"
                decoding="async"
              />
              <S.Hivetron>HIVETRON</S.Hivetron>{" "}
              <S.Technology>TECHNOLOGY</S.Technology>
            </S.Empresa>
          </S.LinhaCreditos>
        </S.Creditos>
      </S.Conteudo>

      {carregando && <Carregamento idioma={idiomaDestino} />}
    </S.Layout>
  );
}
