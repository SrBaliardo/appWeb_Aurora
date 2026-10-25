import { useEffect, useState } from "react";
import { useQuebraCabeca } from "../../../../contexts/quebracabeca/index.js";

export function usePartida(nivel) {
  const jogo = useQuebraCabeca();
  const [temaId, setTemaId] = useState("aurora");
  const [geracao, setGeracao] = useState(0);
  const [imagem, setImagem] = useState(null);
  const [rodada, setRodada] = useState(() => jogo.novaRodada(nivel));
  const [etapa, setEtapa] = useState("escolher");
  const [encaixadas, setEncaixadas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [sinal, setSinal] = useState(null);
  const [feedback, setFeedback] = useState({
    tipo: "neutro",
    texto: "Escolha um tema e uma imagem para montar.",
    chave: 0,
  });
  const tema = jogo.temas.find((item) => item.id === temaId);
  const venceu = jogo.concluiu(rodada.pecas, encaixadas);

  useEffect(() => {
    if (etapa !== "carregando" || !imagem?.src) return undefined;
    let cancelado = false;
    const figura = new Image();
    const falhou = () => {
      if (cancelado) return;
      window.clearTimeout(timer);
      setEtapa("erro");
      setFeedback((atual) => ({
        tipo: "erro",
        texto: "Não foi possível carregar a imagem. Tente novamente.",
        chave: atual.chave + 1,
      }));
    };
    const timer = window.setTimeout(falhou, 20000);
    figura.onload = () => {
      window.clearTimeout(timer);
      if (!cancelado) setEtapa("previa");
    };
    figura.onerror = falhou;
    figura.src = imagem.src;
    if (figura.complete && figura.naturalWidth > 0) figura.onload();
    return () => {
      cancelado = true;
      window.clearTimeout(timer);
      figura.onload = null;
      figura.onerror = null;
    };
  }, [etapa, imagem, geracao]);
  useEffect(() => {
    if (etapa !== "previa") return undefined;
    const timer = window.setTimeout(() => {
      setEtapa("montar");
      setFeedback((atual) => ({
        tipo: "neutro",
        texto: "Vamos montar? Cada peça tem seu lugar.",
        chave: atual.chave + 1,
      }));
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [etapa, imagem, geracao]);
  useEffect(() => {
    if (!sinal) return undefined;
    const timer = window.setTimeout(() => setSinal(null), 650);
    return () => window.clearTimeout(timer);
  }, [sinal]);

  function mensagem(tipo, texto) {
    setFeedback((atual) => ({ tipo, texto, chave: atual.chave + 1 }));
  }
  function escolherImagem(novaImagem) {
    setGeracao((atual) => atual + 1);
    setImagem(novaImagem);
    setRodada(jogo.novaRodada(nivel));
    setEncaixadas([]);
    setSelecionada(null);
    setSinal(null);
    setEtapa(novaImagem.src ? "carregando" : "previa");
    mensagem("neutro", "Observe a imagem! Já vamos embaralhar as peças.");
  }
  function escolherTema(id) {
    setGeracao((atual) => atual + 1);
    setTemaId(id);
    setImagem(null);
    setEtapa("escolher");
    setEncaixadas([]);
    setSelecionada(null);
    setSinal(null);
    mensagem("neutro", "Escolha um tema e uma imagem para montar.");
  }
  function avaliar(pecaId, destino) {
    return jogo.avaliarEncaixe(rodada.pecas, encaixadas, pecaId, destino);
  }
  function encaixar(pecaId, destino) {
    if (etapa !== "montar" || venceu) return;
    const resultado = avaliar(pecaId, destino);
    if (resultado === "ignorar") return;
    setSinal({ destino, resultado });
    if (resultado === "erro") {
      mensagem("erro", "Ainda não é aqui. Experimente outro lugar!");
      return;
    }
    const novas = [...encaixadas, pecaId];
    setEncaixadas(novas);
    setSelecionada(null);
    mensagem(
      jogo.concluiu(rodada.pecas, novas) ? "festa" : "acerto",
      jogo.concluiu(rodada.pecas, novas)
        ? "Você montou um lindo quadro! Que aventura!"
        : "Encaixou! Mais um pedacinho da aventura.",
    );
  }
  function selecionar(id) {
    if (etapa !== "montar" || venceu) return;
    setSelecionada((atual) => (atual === id ? null : id));
    mensagem("neutro", "Agora escolha um espaço na moldura.");
  }
  return {
    temas: jogo.temas,
    tema,
    imagem,
    rodada,
    etapa,
    encaixadas,
    selecionada,
    sinal,
    feedback,
    venceu,
    geracao,
    escolherTema,
    escolherImagem,
    avaliar,
    encaixar,
    selecionar,
    reiniciar: () => imagem && escolherImagem(imagem),
  };
}
