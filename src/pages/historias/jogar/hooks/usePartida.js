import { useState } from "react";
import { useHistorias } from "../../../../contexts/historias/index.js";

export function usePartida(nivel) {
  const jogo = useHistorias();
  const [rodada, setRodada] = useState(() =>
    jogo.novaRodada(undefined, undefined, nivel),
  );
  const [ordem, setOrdem] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [conferida, setConferida] = useState(false);
  const [venceu, setVenceu] = useState(false);
  const [geracao, setGeracao] = useState(0);
  const [feedback, setFeedback] = useState({
    tipo: "neutro",
    texto: "O que aconteceu primeiro? E depois?",
    chave: 0,
  });

  function colocar(id, destino) {
    if (venceu) return;
    const nova = jogo.posicionar(rodada.cenas, ordem, id, destino);
    if (!nova) return;
    setOrdem(nova);
    setSelecionada(null);
    setFeedback((atual) => ({
      tipo: "neutro",
      texto: "Quando terminar, confira a ordem da história.",
      chave: atual.chave + 1,
    }));
  }

  function escolherEspaco(posicao) {
    if (venceu) return;
    if (selecionada) {
      colocar(selecionada, posicao);
      return;
    }
    if (ordem[posicao])
      setOrdem((atual) =>
        atual.map((id, indice) => (indice === posicao ? null : id)),
      );
  }

  function conferir() {
    if (venceu) return;
    const correto = jogo.concluiu(rodada, ordem);
    setConferida(true);
    setVenceu(correto);
    setFeedback((atual) => ({
      tipo: correto ? "festa" : "erro",
      texto: correto
        ? "Sua história ficou em ordem! Que aventura bonita!"
        : "Vamos pensar de novo? Os espaços marcados precisam de outra cena.",
      chave: atual.chave + 1,
    }));
  }

  function reiniciar() {
    setRodada(jogo.novaRodada(rodada.id, undefined, nivel));
    setOrdem([]);
    setSelecionada(null);
    setConferida(false);
    setVenceu(false);
    setGeracao((atual) => atual + 1);
    setFeedback((atual) => ({
      tipo: "neutro",
      texto: "Uma nova história para organizar!",
      chave: atual.chave + 1,
    }));
  }

  return {
    rodada,
    ordem,
    selecionada,
    venceu,
    geracao,
    feedback,
    colocar,
    escolherEspaco,
    conferir,
    reiniciar,
    selecionar: (id) => {
      if (!venceu) setSelecionada((atual) => (atual === id ? null : id));
    },
    resultados: conferida ? jogo.avaliar(rodada, ordem) : [],
    preenchida: jogo.preenchida(rodada, ordem),
  };
}
