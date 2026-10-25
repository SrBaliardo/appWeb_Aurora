import { useCallback, useState } from "react";
import { useEscrita } from "../../../../contexts/escrita/index.js";
import { useTecladoAlfabetico } from "../../../../hooks/useTecladoAlfabetico.js";

export function usePartida(nivel = "facil", idioma = "pt-BR") {
  const jogo = useEscrita(idioma);
  const [rodada, setRodada] = useState(() =>
    jogo.novaRodada(undefined, undefined, nivel, idioma),
  );
  const [letras, setLetras] = useState([]);
  const [quantidadeDicas, setQuantidadeDicas] = useState(0);
  const [feedback, setFeedback] = useState({
    tipo: "neutro",
    texto: "Escreva uma letra de cada vez, da esquerda para a direita.",
    chave: 0,
  });
  const resultado = jogo.avaliar(rodada, letras);
  const escolher = useCallback(
    (entrada) => {
      const letra = jogo.normalizarEntrada(entrada);
      if (resultado.venceu || !jogo.alfabeto.includes(letra)) return;
      const acertou = jogo.podeAdicionar(rodada, letras, letra);
      if (acertou) setLetras((atuais) => [...atuais, letra]);
      const venceu = acertou && jogo.avaliar(rodada, [...letras, letra]).venceu;
      setFeedback((atual) => ({
        tipo: venceu ? "festa" : acertou ? "acerto" : "erro",
        texto: venceu
          ? `Muito bem! Você escreveu ${rodada.texto}!`
          : acertou
            ? "Boa! Agora escolha a próxima letra."
            : "Ainda não é essa letra. Tente outra!",
        chave: atual.chave + 1,
      }));
    },
    [jogo, letras, resultado.venceu, rodada],
  );

  useTecladoAlfabetico(jogo.alfabeto, jogo.normalizarEntrada, escolher);

  function reiniciar() {
    setRodada(jogo.novaRodada(rodada.id, undefined, nivel, idioma));
    setLetras([]);
    setQuantidadeDicas(0);
    setFeedback((atual) => ({
      tipo: "neutro",
      texto: "Uma nova figura para escrever!",
      chave: atual.chave + 1,
    }));
  }

  return {
    rodada,
    resultado,
    feedback,
    escolher,
    reiniciar,
    alfabeto: jogo.alfabeto,
    dicas: rodada.dicas.slice(0, quantidadeDicas),
    dicasEsgotadas: quantidadeDicas >= rodada.dicas.length,
    pedirDica: () =>
      setQuantidadeDicas((atual) => Math.min(atual + 1, rodada.dicas.length)),
  };
}
