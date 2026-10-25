import { useEffect, useState } from "react";
import { useClassificacao } from "../../../../contexts/classificacao/index.js";

export function usePartida(nivel) {
  const jogo = useClassificacao();
  const [rodada, setRodada] = useState(() =>
    jogo.novaRodada(undefined, undefined, nivel),
  );
  const [organizados, setOrganizados] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [sinal, setSinal] = useState(null);
  const [geracao, setGeracao] = useState(0);
  const [feedback, setFeedback] = useState({
    tipo: "neutro",
    texto: "Cada figura tem seu grupo. Vamos organizar?",
    chave: 0,
  });
  const venceu = jogo.concluiu(rodada, organizados);

  useEffect(() => {
    if (!sinal) return undefined;
    const timer = window.setTimeout(() => setSinal(null), 700);
    return () => window.clearTimeout(timer);
  }, [sinal]);

  function avaliar(id, grupo) {
    return jogo.avaliar(rodada, organizados, id, grupo);
  }

  function colocar(id, grupo) {
    if (venceu) return;
    const resultado = avaliar(id, grupo);
    if (resultado === "ignorar") return;
    setSinal({ grupo, resultado });
    if (resultado === "erro") {
      setFeedback((atual) => ({
        tipo: "erro",
        texto: "Este grupo é diferente. Observe os nomes e tente outro!",
        chave: atual.chave + 1,
      }));
      return;
    }
    const novos = [...organizados, id];
    setOrganizados(novos);
    setSelecionado(null);
    setFeedback((atual) => ({
      tipo: jogo.concluiu(rodada, novos) ? "festa" : "acerto",
      texto: jogo.concluiu(rodada, novos)
        ? "Tudo no lugar! Você organizou as coleções!"
        : "Isso! Esta figura pertence a este grupo.",
      chave: atual.chave + 1,
    }));
  }

  function selecionar(id) {
    if (venceu || organizados.includes(id)) return;
    setSelecionado((atual) => (atual === id ? null : id));
    setFeedback((atual) => ({
      tipo: "neutro",
      texto: "Agora escolha o grupo da figura.",
      chave: atual.chave + 1,
    }));
  }

  function reiniciar() {
    setRodada(jogo.novaRodada(rodada.id, undefined, nivel));
    setOrganizados([]);
    setSelecionado(null);
    setSinal(null);
    setGeracao((atual) => atual + 1);
    setFeedback((atual) => ({
      tipo: "neutro",
      texto: "Novas figuras para organizar!",
      chave: atual.chave + 1,
    }));
  }

  return {
    rodada,
    organizados,
    selecionado,
    sinal,
    venceu,
    feedback,
    geracao,
    avaliar,
    colocar,
    selecionar,
    reiniciar,
  };
}
