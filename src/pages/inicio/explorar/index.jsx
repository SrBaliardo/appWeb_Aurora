import { useLivros } from "../../../contexts/livros/index.js";
import { useInterface } from "../../../contexts/interface/index.js";
import Icone from "../../../components/Icone/index.jsx";
import BosqueAurora from "./components/BosqueAurora/index.jsx";
import { useCarrossel } from "./hooks/useCarrossel.js";
import * as S from "./styles";

const jogos = [
  {
    id: "quebracabeca",
    nome: "Pedacinhos de aventura",
    categoria: "Encaixar e imaginar",
    descricao: "Monte imagens da turma, animais e brinquedos.",
    fundo: "#f8df9b",
    cor: "#876021",
  },
  {
    id: "forca",
    nome: "Forca do bosque",
    categoria: "Letras e descobertas",
    descricao: "Siga as dicas e descubra a palavra escondida.",
    fundo: "#d6f191",
    cor: "#477226",
  },
  {
    id: "palavras",
    nome: "Cadê a letrinha?",
    categoria: "Pequenos leitores",
    descricao: "Encontre as letras que saíram para passear.",
    fundo: "#dec3fa",
    cor: "#7940aa",
  },
  {
    id: "memoria",
    nome: "Amigos da memória",
    categoria: "Olhar e lembrar",
    descricao: "Junte os pares de animais e brinquedos.",
    fundo: "#9ee1f7",
    cor: "#186f8b",
  },
  {
    id: "cores",
    nome: "Um mundo de cores",
    categoria: "Ver e aprender",
    descricao: "Uma figura, muitas cores. Qual é o nome?",
    fundo: "#ffd396",
    cor: "#9a5015",
  },
  {
    id: "descobertas",
    nome: "O que é isso?",
    categoria: "Olhar e descobrir",
    descricao: "Descubra os nomes de objetos, formas e números.",
    fundo: "#bfe9fa",
    cor: "#186f8b",
  },
  {
    id: "matematica",
    nome: "Continhas da turma",
    categoria: "Pensar e contar",
    descricao: "Escolha o resultado e complete cada continha.",
    fundo: "#ffe48d",
    cor: "#8e6515",
  },
  {
    id: "escrita",
    nome: "Vejo e escrevo",
    categoria: "Letra por letra",
    descricao: "Escreva o nome das figuras e dos números.",
    fundo: "#ddc5fa",
    cor: "#7940aa",
  },
  {
    id: "sequencias",
    nome: "Sequências da Aurora",
    categoria: "Observar padrões",
    descricao: "Complete padrões de figuras e números.",
    fundo: "#ffe3a5",
    cor: "#50683c",
  },
  {
    id: "contagem",
    nome: "Quantos há no bosque?",
    categoria: "Olhar e contar",
    descricao: "Conte as figuras escondidas em cada cena.",
    fundo: "#d6edb1",
    cor: "#50683c",
  },
  {
    id: "classificacao",
    nome: "Cada coisa em seu lugar",
    categoria: "Separar e descobrir",
    descricao: "Organize as figuras em grupos divertidos.",
    fundo: "#fbe2a2",
    cor: "#50683c",
  },
  {
    id: "iniciais",
    nome: "Qual é a primeira letrinha?",
    categoria: "Começos das palavras",
    descricao: "Encontre a letra ou sílaba que começa a palavra.",
    fundo: "#e6cef7",
    cor: "#50683c",
  },
  {
    id: "historias",
    nome: "A história embaralhada",
    categoria: "Imaginar e ordenar",
    descricao: "Coloque as cenas na ordem da aventura.",
    fundo: "#d9d1f6",
    cor: "#50683c",
  },
];

function Miniatura({ id }) {
  if (id === "sequencias") return <S.Simbolo aria-hidden="true">🍎</S.Simbolo>;
  if (id === "contagem") return <S.Simbolo aria-hidden="true">🦋</S.Simbolo>;
  if (id === "classificacao")
    return <S.Simbolo aria-hidden="true">🧺</S.Simbolo>;
  if (id === "iniciais") return <S.Simbolo aria-hidden="true">🔤</S.Simbolo>;
  if (id === "historias") return <S.Simbolo aria-hidden="true">📖</S.Simbolo>;
  if (id === "quebracabeca")
    return <S.Simbolo aria-hidden="true">🧩</S.Simbolo>;
  if (id === "matematica")
    return (
      <>
        {["2", "+", "3"].map((letra, i) => (
          <S.Letras key={i} $angulo={[-8, 5, -4][i]}>
            {letra}
          </S.Letras>
        ))}
      </>
    );
  if (id === "escrita")
    return (
      <>
        {["C", "I", "N", "_"].map((letra, i) => (
          <S.Letras key={i} $angulo={[-8, 5, -4, 7][i]}>
            {letra}
          </S.Letras>
        ))}
      </>
    );
  if (id === "descobertas")
    return <S.Simbolo aria-hidden="true">🔎 🔺</S.Simbolo>;
  if (id === "forca")
    return (
      <>
        {["B", "O", "S", "_"].map((letra, i) => (
          <S.Letras key={i} $angulo={[-9, 5, -4, 8][i]}>
            {letra}
          </S.Letras>
        ))}
      </>
    );
  if (id === "palavras")
    return (
      <>
        {["A", "_", "B"].map((letra, i) => (
          <S.Letras key={i} $angulo={[-8, 8, -4][i]}>
            {letra}
          </S.Letras>
        ))}
      </>
    );
  if (id === "memoria")
    return (
      <S.Cartinhas>
        <span>🦊</span>
        <span>🌿</span>
        <span>🌿</span>
        <span>🦊</span>
      </S.Cartinhas>
    );
  return (
    <S.Forminhas>
      <span />
      <span />
      <span />
    </S.Forminhas>
  );
}

const capasColorir = {
  "pt-BR": "/colorir/capas/bosque.png",
  "en-US": "/colorir/en-US/capas/bosque.png",
  "es-ES": "/colorir/es-ES/capas/bosque.png",
};

export default function Inicio() {
  const { t, idiomaInterface } = useInterface();
  const {
    destaque,
    setDestaque,
    pausado,
    aoEntrarMouse,
    aoSairMouse,
    aoFocar,
    aoDesfocar,
  } = useCarrossel();
  const { livros, livroGratuito } = useLivros(idiomaInterface);
  return (
    <>
      <S.Hero
        aria-label={t("Aventuras em destaque")}
        aria-roledescription={t("Carrossel")}
        onMouseEnter={aoEntrarMouse}
        onMouseLeave={aoSairMouse}
        onFocus={aoFocar}
        onBlur={aoDesfocar}
      >
        {destaque === 0 ? (
          <>
            <S.TextoHero>
              <S.Selo>
                <Icone nome="estrela" tamanho={14} />{" "}
                {t("PEQUENAS GRANDES DESCOBERTAS")}
              </S.Selo>
              <S.Titulo tabIndex={-1}>
                {t("Aprender é")}
                <br />
                {t("uma")} <span>{t("aventura.")}</span>
              </S.Titulo>
              <S.Descricao>
                {t(
                  "Entre no bosque da Aurora e descubra um mundo de letras, cores e novos amigos!",
                )}
              </S.Descricao>
              <S.Botao
                variant="contained"
                component="a"
                href="#brincadeiras"
                endIcon={<Icone nome="seta" tamanho={20} />}
              >
                {t("Vamos brincar?")}
              </S.Botao>
              <S.NotaHero>
                <Icone nome="coracao" tamanho={14} />{" "}
                {t("Feito para aprender no seu próprio ritmo.")}
              </S.NotaHero>
            </S.TextoHero>
            <S.Arte>
              <BosqueAurora />
            </S.Arte>
          </>
        ) : destaque === 1 ? (
          <>
            <S.TextoHero>
              <S.Selo>
                <Icone nome="livro" tamanho={16} />
                {t("HISTÓRIAS PARA IMAGINAR")}
              </S.Selo>
              <S.Titulo tabIndex={-1}>{t("Vamos ler uma aventura?")}</S.Titulo>
              <S.Descricao>
                {t(
                  "Leia uma história grátis e conheça a coleção da Aurora e sua turma.",
                )}
              </S.Descricao>
              <S.Botao
                variant="contained"
                component="a"
                href="#/livros"
                endIcon={<Icone nome="seta" />}
              >
                {t("Ver os livros")}
              </S.Botao>
              <S.NotaHero>{t(livroGratuito.legendaIdioma)}</S.NotaHero>
            </S.TextoHero>
            <S.Capas aria-hidden="true">
              <img src={livros[1].capa} alt="" />
              <img src={livroGratuito.capa} alt="" />
              <img src={livros[2].capa} alt="" />
            </S.Capas>
          </>
        ) : (
          <>
            <S.TextoHero>
              <S.Selo>
                <Icone nome="cores" tamanho={16} />
                {t("AURORA GOODIES · CORES E IMAGINAÇÃO")}
              </S.Selo>
              <S.Titulo tabIndex={-1}>
                {t("Vamos colorir uma aventura?")}
              </S.Titulo>
              <S.Descricao>
                {t(
                  "Dê vida ao bosque com suas cores favoritas. Pinte, salve e continue quando quiser!",
                )}
              </S.Descricao>
              <S.Botao
                variant="contained"
                component="a"
                href="#/colorir"
                endIcon={<Icone nome="seta" />}
              >
                {t("Vamos colorir!")}
              </S.Botao>
              <S.NotaHero>
                {t("32 desenhos gratuitos para imaginar")}
              </S.NotaHero>
            </S.TextoHero>
            <S.ArteColorir aria-hidden="true">
              <img
                src={capasColorir[idiomaInterface] || capasColorir["pt-BR"]}
                alt=""
              />
              <span>🎨</span>
              <i>● ● ● ●</i>
            </S.ArteColorir>
          </>
        )}
        <S.Controles>
          <S.Controle
            onClick={() => setDestaque((atual) => (atual + 2) % 3)}
            aria-label={t("Destaque anterior")}
          >
            <Icone nome="voltar" />
          </S.Controle>
          <S.Indicador
            $ativo={destaque === 0}
            aria-pressed={destaque === 0}
            onClick={() => setDestaque(0)}
            aria-label={t("Mostrar brincadeiras")}
          />
          <S.Indicador
            $ativo={destaque === 1}
            aria-pressed={destaque === 1}
            onClick={() => setDestaque(1)}
            aria-label={t("Mostrar livros")}
          />
          <S.Indicador
            $ativo={destaque === 2}
            aria-pressed={destaque === 2}
            onClick={() => setDestaque(2)}
            aria-label={t("Mostrar desenhos para colorir")}
          />
          <S.Controle
            onClick={() => setDestaque((atual) => (atual + 1) % 3)}
            aria-label={t("Próximo destaque")}
          >
            <Icone nome="seta" />
          </S.Controle>
          <S.EstadoDestaque
            role="status"
            aria-live={pausado ? "polite" : "off"}
          >
            {t("Destaque {atual} de {total}", {
              atual: destaque + 1,
              total: 3,
            })}
          </S.EstadoDestaque>
        </S.Controles>
      </S.Hero>
      <section aria-labelledby="titulo-brincadeiras">
        <S.CabecalhoJogos id="brincadeiras">
          <div>
            <h2 id="titulo-brincadeiras">{t("Qual é a aventura de hoje?")}</h2>
            <p>
              {t(
                "Escolha uma brincadeira. A diversão começa com a curiosidade!",
              )}
            </p>
          </div>
          <span>{t("13 jeitos de descobrir ✦")}</span>
        </S.CabecalhoJogos>
        <S.Grade>
          {jogos.map((jogo) => (
            <S.Cartao
              key={jogo.id}
              href={`#/${jogo.id}`}
              aria-label={t("Jogar {nome}", { nome: t(jogo.nome) })}
            >
              <S.Miniatura $fundo={jogo.fundo} aria-hidden="true">
                <Miniatura id={jogo.id} />
              </S.Miniatura>
              <S.CorpoCartao>
                <S.Categoria $cor={jogo.cor}>{t(jogo.categoria)}</S.Categoria>
                <h3>{t(jogo.nome)}</h3>
                <p>{t(jogo.descricao)}</p>
                <S.Jogar>
                  {t("Vamos jogar")} <Icone nome="seta" tamanho={18} />
                </S.Jogar>
              </S.CorpoCartao>
            </S.Cartao>
          ))}
        </S.Grade>
      </section>
      <S.Convite>
        <span aria-hidden="true">🌱</span>
        <div>
          <h2>{t("Aqui, cada tentativa faz crescer.")}</h2>
          <p>
            {t(
              "Não precisa correr. Explore, peça uma dica e tente de novo. Aurora e sua turma estão com você!",
            )}
          </p>
        </div>
      </S.Convite>
    </>
  );
}
