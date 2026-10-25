import { useCallback, useState } from "react";
import { useTecladoAlfabetico } from "./useTecladoAlfabetico.js";

export function useRodadaDeLetras(
  operacoes,
  nivel = "facil",
  idioma = "pt-BR",
) {
  const [rodada, setRodada] = useState(() =>
    operacoes.novaRodada(undefined, undefined, nivel, idioma),
  );
  const [tentativas, setTentativas] = useState([]);
  const [quantidadeDicas, setQuantidadeDicas] = useState(0);
  const [feedback, setFeedback] = useState({
    tipo: "neutro",
    texto: "Escolha uma letra para começar.",
    chave: 0,
  });
  const resultado = operacoes.avaliar(rodada, tentativas);
  const escolher = useCallback(
    (entrada) => {
      const letra = operacoes.normalizarEntrada(entrada);
      if (
        resultado.encerrou ||
        resultado.bloqueadas?.includes(letra) ||
        !operacoes.alfabeto.includes(letra) ||
        tentativas.includes(letra)
      )
        return;
      const proximas = [...tentativas, letra];
      const avaliacao = operacoes.avaliar(rodada, proximas);
      const acertou = avaliacao.corretas.includes(letra);
      setTentativas(proximas);
      setFeedback((atual) => ({
        tipo: avaliacao.venceu ? "festa" : acertou ? "acerto" : "erro",
        texto: avaliacao.venceu
          ? "Viva! Você descobriu a palavra!"
          : avaliacao.encerrou
            ? `A palavra era ${rodada.texto}. Vamos tentar outra?`
            : acertou
              ? "Boa! Essa letra está na palavra!"
              : "Essa letra não está aqui. Tente outra!",
        chave: atual.chave + 1,
      }));
    },
    [operacoes, resultado.encerrou, resultado.bloqueadas, rodada, tentativas],
  );

  useTecladoAlfabetico(
    operacoes.alfabeto,
    operacoes.normalizarEntrada,
    escolher,
  );

  function reiniciar() {
    setRodada(operacoes.novaRodada(rodada.id, undefined, nivel, idioma));
    setTentativas([]);
    setQuantidadeDicas(0);
    setFeedback((atual) => ({
      tipo: "neutro",
      texto: "Uma nova palavra espera por você!",
      chave: atual.chave + 1,
    }));
  }

  return {
    rodada,
    tentativas,
    resultado,
    feedback,
    escolher,
    reiniciar,
    alfabeto: operacoes.alfabeto,
    dicas: operacoes.dicas(rodada, quantidadeDicas, nivel),
    dicasEsgotadas:
      quantidadeDicas >= operacoes.dicas(rodada, Infinity, nivel).length,
    pedirDica: () =>
      setQuantidadeDicas((atual) =>
        Math.min(atual + 1, operacoes.dicas(rodada, Infinity, nivel).length),
      ),
  };
}
