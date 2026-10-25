import { construirRodada, construirFigura } from "./builders/rodada.js";
import { avaliarDescoberta } from "./regras.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { criarLeitorNavegador } from "../../services/descobertas/index.js";

const operacoes = { novaRodada: construirRodada, avaliar: avaliarDescoberta };
export function useDescobertas() {
  return operacoes;
}

export function sortearFigura(anterior, random, nivel, tipos, idioma) {
  return construirFigura(anterior, random, nivel, tipos, idioma);
}

export function useVozDescobertas(idioma, rodadaId) {
  const leitor = useRef(null);
  const [disponivel, setDisponivel] = useState(null);
  const [estado, setEstado] = useState({
    status: "ocioso",
    texto: null,
    erro: null,
  });

  useEffect(() => {
    const instancia = criarLeitorNavegador({ aoEstado: setEstado });
    leitor.current = instancia;
    setDisponivel(instancia.disponivel);
    setEstado({ status: "ocioso", texto: null, erro: null });
    return () => {
      leitor.current = null;
      instancia.destruir();
    };
  }, [idioma, rodadaId]);

  const falar = useCallback(
    (opcao) => leitor.current?.falar(opcao.texto, idioma),
    [idioma],
  );
  const aviso =
    disponivel === false
      ? "Este navegador não oferece leitura em voz alta."
      : ["language-unavailable", "voice-unavailable"].includes(estado.erro)
        ? "O navegador não conseguiu usar uma voz neste idioma. Confira as vozes instaladas ou experimente outro navegador."
        : estado.erro
          ? "Não foi possível ouvir agora. Toque no alto-falante para tentar de novo."
          : "";
  return { disponivel, falar, textoAtivo: estado.texto, aviso };
}
