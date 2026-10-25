import { useInterface } from "../../../contexts/interface/index.js";
import BotaoReiniciar from "../../../components/BotaoReiniciar/index.jsx";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import Feedback from "../../../components/Feedback/index.jsx";
import Icone from "../../../components/Icone/index.jsx";
import FiguraConteudo from "../../../components/FiguraConteudo/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
import * as S from "./styles";

export default function Memoria({
  nivel,
  alterarNivel,
  idioma = "pt-BR",
  alterarIdioma,
}) {
  const { t } = useInterface();
  const partida = usePartida(nivel, idioma);

  return (
    <MolduraJogo
      idioma={idioma}
      alterarIdioma={alterarIdioma}
      nivel={nivel}
      alterarNivel={alterarNivel}
      titulo={t("Amigos da memória")}
      descricao={t("Olhe com carinho e descubra quem faz par com quem.")}
      emoji="🧩"
      fundo="#dfeef4"
    >
      <S.Ferramentas>
        <S.Temas role="group" aria-label={t("Tema das cartas")}>
          {partida.temas.map((tema) => (
            <S.Tema
              key={tema.id}
              $ativo={partida.tema === tema.id}
              aria-pressed={partida.tema === tema.id}
              onClick={() => partida.reiniciar(tema.id)}
            >
              <span aria-hidden="true">{tema.emoji}&nbsp;</span>
              {t(tema.nome)}
            </S.Tema>
          ))}
        </S.Temas>
        <span>{t("4 × 4 · 8 pares")}</span>
      </S.Ferramentas>
      <S.Contadores>
        <span>
          {t("Pares:")} <strong>{partida.encontradas.length / 2} / 8</strong>
        </span>
        <span>
          {t("Jogadas:")} <strong>{partida.jogadas}</strong>
        </span>
      </S.Contadores>
      <S.Grade
        role="group"
        aria-label={t("Tabuleiro de dezesseis cartas")}
        aria-busy={partida.previa}
      >
        {partida.cartas.map((carta, i) => {
          const encontrada = partida.encontradas.includes(carta.id);
          const aberta =
            partida.previa || encontrada || partida.abertas.includes(carta.id);
          return (
            <S.Carta
              key={carta.id}
              type="button"
              $encontrada={encontrada}
              disabled={partida.bloqueado || encontrada || aberta}
              onClick={() => partida.virar(carta.id)}
              aria-label={t(
                `Carta ${i + 1}: ${aberta ? carta.nome : t("escondida")}${encontrada ? t(", par encontrado") : ""}`,
              )}
              aria-pressed={aberta}
            >
              <S.Interior $aberta={aberta} aria-hidden="true">
                <S.Verso>
                  <Icone nome="folha" />
                </S.Verso>
                <S.Frente $encontrada={encontrada}>
                  {encontrada && <S.SeloEncontrado>✓</S.SeloEncontrado>}
                  <S.Figura $encontrada={encontrada}>
                    <FiguraConteudo figura={carta.figura} />
                  </S.Figura>
                  {partida.mostrarNomes && (
                    <S.Nome lang={idioma}>{carta.nome}</S.Nome>
                  )}
                </S.Frente>
              </S.Interior>
            </S.Carta>
          );
        })}
      </S.Grade>
      <Feedback feedback={partida.feedback} />
      <S.Rodape>
        <BotaoReiniciar
          variant={partida.venceu ? "contained" : "outlined"}
          onClick={() => partida.reiniciar()}
        >
          {t("Embaralhar de novo")}
        </BotaoReiniciar>
      </S.Rodape>
    </MolduraJogo>
  );
}
