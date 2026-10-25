import { useInterface } from "../../../contexts/interface/index.js";
import MolduraJogo from "../../../components/MolduraJogo/index.jsx";
import AreaLetras from "../../../components/AreaLetras/index.jsx";
import Boneco from "./components/Boneco/index.jsx";
import { usePartida } from "./hooks/usePartida.js";

export default function Forca({
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
      titulo={t("Forca do bosque")}
      descricao={t("Uma letra de cada vez, uma nova descoberta!")}
      emoji="🌿"
      fundo="#e7edcf"
    >
      <AreaLetras
        partida={partida}
        instrucao={t("Que palavra está escondida?")}
      >
        <Boneco
          erros={partida.resultado.erros}
          restantes={partida.resultado.restantes}
          venceu={partida.resultado.venceu}
        />
      </AreaLetras>
    </MolduraJogo>
  );
}
