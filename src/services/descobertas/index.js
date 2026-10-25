import { selecionarVoz } from "../../utils/selecionarVoz.js";

export function criarLeitorNavegador({
  ambiente = globalThis,
  aoEstado = () => {},
} = {}) {
  const sintese = ambiente.speechSynthesis;
  const Frase = ambiente.SpeechSynthesisUtterance;
  const disponivel = Boolean(sintese && typeof Frase === "function");
  let atual = null;
  let encerrado = false;
  let vozes = [];

  function atualizarVozes() {
    try {
      vozes = sintese.getVoices();
    } catch {
      vozes = [];
    }
  }
  if (disponivel) {
    atualizarVozes();
    sintese.addEventListener?.("voiceschanged", atualizarVozes);
  }

  function cancelar() {
    if (!atual) return;
    atual.onstart = null;
    atual.onend = null;
    atual.onerror = null;
    atual = null;
    sintese.cancel();
  }

  function falar(texto, idioma) {
    if (encerrado || !disponivel) return;
    cancelar();
    atualizarVozes();
    const voz = selecionarVoz(vozes, idioma);
    try {
      const frase = new Frase(texto.toLocaleLowerCase(idioma));
      frase.lang = idioma;
      if (voz) frase.voice = voz;
      frase.rate = 0.9;
      frase.pitch = 1;
      frase.volume = 1;
      atual = frase;
      const concluir = (erro) => {
        if (encerrado || atual !== frase) return;
        atual = null;
        aoEstado({
          status: erro ? "erro" : "ocioso",
          texto: null,
          erro: erro || null,
        });
      };
      frase.onstart = () => {
        if (!encerrado && atual === frase)
          aoEstado({ status: "falando", texto, erro: null });
      };
      frase.onend = () => concluir();
      frase.onerror = (evento) => concluir(evento.error || "falha");
      aoEstado({ status: "preparando", texto, erro: null });
      if (sintese.paused) sintese.resume();
      sintese.speak(frase);
    } catch {
      cancelar();
      aoEstado({ status: "erro", texto: null, erro: "falha" });
    }
  }

  function destruir() {
    encerrado = true;
    cancelar();
    if (disponivel)
      sintese.removeEventListener?.("voiceschanged", atualizarVozes);
  }
  return { disponivel, falar, destruir };
}
