import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import PartidaOpcoes from "../../../components/PartidaOpcoes/index.jsx";
import { usePartida } from "./hooks/usePartida.js";
// Áudio em standby por solicitação. Preservado para uma futura retomada.
// import { useVozDescobertas } from '../../../contexts/descobertas/index.js';
// import BotaoOuvir from './components/BotaoOuvir/index.jsx';

export default function Descobertas({
  nivel,
  alterarNivel,
  idioma = "pt-BR",
  alterarIdioma,
}) {
  const { t } = useInterface();
  const partida = usePartida(nivel, idioma);
  // const voz = useVozDescobertas(idioma, partida.rodada.id);
  // Para retomar: adicionar a PartidaOpcoes avisoOpcoes={voz.aviso} e
  // renderizarAcaoOpcao={opcao => <BotaoOuvir opcao={opcao} voz={voz} />}.

  return (
    <MolduraJogo
      idioma={idioma}
      alterarIdioma={alterarIdioma}
      nivel={nivel}
      alterarNivel={alterarNivel}
      titulo={t("O que é isso?")}
      descricao={t("Objetos, formas e números: cada figura tem um nome!")}
      emoji="🔎"
      fundo="#c5eef7"
    >
      <PartidaOpcoes partida={partida} />
    </MolduraJogo>
  );
}
