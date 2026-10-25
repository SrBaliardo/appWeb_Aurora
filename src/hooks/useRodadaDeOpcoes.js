import { useState } from "react";

export function useRodadaDeOpcoes(jogo, nivel = "facil", idioma = "pt-BR") {
  const [rodada, setRodada] = useState(() =>
    jogo.novaRodada(undefined, undefined, nivel, idioma),
  );
  const [tentativas, setTentativas] = useState([]);
  const [venceu, setVenceu] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [quantidadeDicas, setQuantidadeDicas] = useState(0);
  const [feedback, setFeedback] = useState({
    tipo: "neutro",
    texto: "Observe com calma e escolha uma resposta.",
    chave: 0,
  });

  function escolher(id) {
    if (venceu || tentativas.includes(id)) return;
    const acertou = jogo.avaliar(rodada, id);
    setTentativas((atuais) => [...atuais, id]);
    setVenceu(acertou);
    if (acertou) setAcertos((atual) => atual + 1);
    setFeedback((atual) => ({
      tipo: acertou ? "festa" : "erro",
      texto: acertou
        ? rodada.confirmacao
        : "Ainda não! Observe de novo ou peça uma dica.",
      chave: atual.chave + 1,
    }));
  }

  function reiniciar() {
    setRodada(jogo.novaRodada(rodada.id, undefined, nivel, idioma));
    setTentativas([]);
    setVenceu(false);
    setQuantidadeDicas(0);
    setFeedback((atual) => ({
      tipo: "neutro",
      texto: "Uma nova descoberta para você!",
      chave: atual.chave + 1,
    }));
  }

  const opcoes = rodada.opcoes.map((opcao) => ({
    ...opcao,
    tentada: tentativas.includes(opcao.id),
    correta: venceu && jogo.avaliar(rodada, opcao.id),
  }));

  return {
    rodada,
    opcoes,
    venceu,
    acertos,
    feedback,
    escolher,
    reiniciar,
    idioma,
    dicas: rodada.dicas.slice(0, quantidadeDicas),
    dicasEsgotadas: quantidadeDicas >= rodada.dicas.length,
    pedirDica: () =>
      setQuantidadeDicas((atual) => Math.min(atual + 1, rodada.dicas.length)),
  };
}
