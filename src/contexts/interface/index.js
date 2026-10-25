import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { construirTradutor } from "./builders/mensagem.js";
import { construirPreferenciasDeIdioma } from "./builders/preferencias.js";
import { idiomaInterfaceValido, selecionarIdiomaPreferido } from "./regras.js";

const carregar = {
  "pt-BR": async () => ({}),
  "en-US": () =>
    import("./mensagens/en-US.js").then((modulo) => modulo.default),
  "es-ES": () =>
    import("./mensagens/es-ES.js").then((modulo) => modulo.default),
};
const ContextoInterface = createContext({
  idiomaInterface: "pt-BR",
  t: construirTradutor(),
  trocarIdiomaInterface: () => {},
  idiomaDoJogo: () => "pt-BR",
  trocarIdiomaDoJogo: () => {},
  carregando: false,
  idiomaDestino: "pt-BR",
  erro: "",
});

export function identificarIdiomaInicial(navegador = globalThis.navigator) {
  try {
    return selecionarIdiomaPreferido(construirPreferenciasDeIdioma(navegador));
  } catch {
    return "en-US";
  }
}

export function ProviderInterface({
  children,
  idiomaInicial,
  mensagensIniciais = {},
}) {
  const [inicial] = useState(() => {
    const explicito = idiomaInterfaceValido(idiomaInicial);
    const desejado = explicito ? idiomaInicial : identificarIdiomaInicial();
    return {
      idioma: explicito ? idiomaInicial : "pt-BR",
      pendente: !explicito && desejado !== "pt-BR" ? desejado : null,
    };
  });
  const [idiomaInterface, setIdioma] = useState(inicial.idioma);
  const [mensagens, setMensagens] = useState(mensagensIniciais);
  const [pendente, setPendente] = useState(inicial.pendente);
  const [idiomasJogos, setIdiomasJogos] = useState({});
  const [erro, setErro] = useState("");
  const ocupada = useRef(Boolean(inicial.pendente));
  const carregando = Boolean(pendente);
  const idiomaDestino = pendente || idiomaInterface;
  useEffect(() => {
    document.documentElement.lang = idiomaInterface;
  }, [idiomaInterface]);
  useEffect(() => {
    if (!pendente) return undefined;
    let cancelada = false,
      temporizador;

    const espera = new Promise((resolve) => {
      temporizador = window.setTimeout(resolve, 900);
    });

    Promise.all([carregar[pendente](), espera])
      .then(([catalogo]) => {
        if (cancelada) return;
        setMensagens(catalogo);
        setIdioma(pendente);
        setIdiomasJogos({});
        ocupada.current = false;
        setPendente(null);
      })
      .catch(() => {
        if (cancelada) return;
        setErro("Não foi possível carregar o idioma. Tente novamente.");
        ocupada.current = false;
        setPendente(null);
      });
    return () => {
      cancelada = true;
      window.clearTimeout(temporizador);
    };
  }, [pendente]);
  const trocarIdiomaInterface = useCallback(
    (novoIdioma) => {
      if (
        !idiomaInterfaceValido(novoIdioma) ||
        novoIdioma === idiomaInterface ||
        ocupada.current
      )
        return;
      ocupada.current = true;
      setErro("");
      setPendente(novoIdioma);
    },
    [idiomaInterface],
  );
  const idiomaDoJogo = useCallback(
    (jogo) => idiomasJogos[jogo] || idiomaInterface,
    [idiomasJogos, idiomaInterface],
  );
  const trocarIdiomaDoJogo = useCallback((jogo, idioma) => {
    if (!idiomaInterfaceValido(idioma) || ocupada.current) return;
    setIdiomasJogos((atuais) => ({ ...atuais, [jogo]: idioma }));
  }, []);
  const t = useMemo(() => construirTradutor(mensagens), [mensagens]);
  const valor = useMemo(
    () => ({
      idiomaInterface,
      t,
      trocarIdiomaInterface,
      idiomaDoJogo,
      trocarIdiomaDoJogo,
      carregando,
      idiomaDestino,
      erro,
    }),
    [
      idiomaInterface,
      t,
      trocarIdiomaInterface,
      idiomaDoJogo,
      trocarIdiomaDoJogo,
      carregando,
      idiomaDestino,
      erro,
    ],
  );

  return createElement(ContextoInterface.Provider, { value: valor }, children);
}

export function useInterface() {
  return useContext(ContextoInterface);
}
