import { useEffect, useState } from "react";
import { useMemoria } from "../../../../contexts/memoria/index.js";

export function usePartida(nivel = "facil", idioma = "pt-BR") {
  const jogo = useMemoria();
  const configuracao = jogo.configuracaoNivel(nivel);
  const [tema, setTema] = useState(jogo.temaPadrao);
  const [cartas, setCartas] = useState(() =>
    jogo.novoTabuleiro(jogo.temaPadrao, undefined, idioma),
  );
  const [abertas, setAbertas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [previa, setPrevia] = useState(true);
  const [rodada, setRodada] = useState(0);
  const [jogadas, setJogadas] = useState(0);
  const [feedback, setFeedback] = useState({
    tipo: "neutro",
    texto: "Observe as figuras. Já vamos esconder!",
    chave: 0,
  });
  const bloqueado = previa || abertas.length === 2;
  const venceu = jogo.concluiu(encontradas);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPrevia(false);
      setFeedback({
        tipo: "neutro",
        texto: "Encontre duas figuras iguais!",
        chave: 0,
      });
    }, configuracao.tempoPrevia);
    return () => window.clearTimeout(timer);
  }, [rodada, configuracao.tempoPrevia]);

  useEffect(() => {
    if (abertas.length !== 2) return undefined;
    const par = cartas.filter((carta) => abertas.includes(carta.id));
    const acertou = jogo.avaliarPar(par);
    const timer = window.setTimeout(
      () => {
        if (acertou) {
          const novas = [...encontradas, ...abertas];
          setEncontradas(novas);
          const completa = jogo.concluiu(novas);
          setFeedback((atual) => ({
            tipo: completa ? "festa" : "acerto",
            texto: completa
              ? "Você encontrou todos os amigos! Que memória boa!"
              : "Um par encontrado! Continue assim!",
            chave: atual.chave + 1,
          }));
        } else {
          setFeedback((atual) => ({
            tipo: "erro",
            texto: "São diferentes. Vamos procurar de novo!",
            chave: atual.chave + 1,
          }));
        }
        setAbertas([]);
      },
      acertou ? 450 : 1000,
    );
    return () => window.clearTimeout(timer);
  }, [abertas, cartas, encontradas, jogo]);

  function virar(id) {
    if (!jogo.podeVirar(id, abertas, encontradas, bloqueado)) return;
    if (abertas.length === 1) setJogadas((atual) => atual + 1);
    setAbertas((atuais) => [...atuais, id]);
  }

  function reiniciar(proximoTema = tema) {
    setTema(proximoTema);
    setCartas(jogo.novoTabuleiro(proximoTema, undefined, idioma));
    setAbertas([]);
    setEncontradas([]);
    setJogadas(0);
    setPrevia(true);
    setRodada((atual) => atual + 1);
    setFeedback((atual) => ({
      tipo: "neutro",
      texto: "Observe as figuras. Já vamos esconder!",
      chave: atual.chave + 1,
    }));
  }

  return {
    temas: jogo.temas,
    tema,
    cartas,
    abertas,
    encontradas,
    previa,
    bloqueado,
    venceu,
    jogadas,
    feedback,
    virar,
    reiniciar,
    mostrarNomes: configuracao.mostrarNomes,
  };
}
