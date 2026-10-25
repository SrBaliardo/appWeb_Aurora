import { useState } from "react";
import { useCores } from "../../../../contexts/cores/index.js";

export function usePartida(nivel = "facil", idioma = "pt-BR") {
  const jogo = useCores();
  const [rodada, setRodada] = useState(() =>
    jogo.novaRodada(undefined, undefined, nivel, idioma),
  );
  const [tentativas, setTentativas] = useState([]);
  const [venceu, setVenceu] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [feedback, setFeedback] = useState({
    tipo: "neutro",
    texto: "Olhe a figura e escolha o nome da cor.",
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
        ? `Isso! A cor é ${rodada.cor.nome.toLocaleLowerCase("pt-BR")}!`
        : "Quase! Olhe mais uma vez e tente outra cor.",
      chave: atual.chave + 1,
    }));
  }

  function reiniciar() {
    setRodada(jogo.novaRodada(rodada.cor.id, undefined, nivel, idioma));
    setTentativas([]);
    setVenceu(false);
    setFeedback((atual) => ({
      tipo: "neutro",
      texto: "E agora, que cor é essa?",
      chave: atual.chave + 1,
    }));
  }
  const opcoes = rodada.opcoes.map((cor) => ({
    ...cor,
    texto: cor.nome,
    tentada: tentativas.includes(cor.id),
    correta:
      venceu && tentativas.includes(cor.id) && jogo.avaliar(rodada, cor.id),
  }));

  return {
    rodada,
    opcoes,
    tentativas,
    venceu,
    acertos,
    feedback,
    escolher,
    reiniciar,
  };
}
