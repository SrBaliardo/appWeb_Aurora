import { useCallback, useEffect, useRef, useState } from "react";
import { useColorir } from "../../../../contexts/colorir/index.js";

export function usePintura(pagina, tituloPadrao = "Meu desenho") {
  const {
    abrirDesenho,
    aplicar,
    regiao,
    restaurar,
    exibir,
    salvar,
    baixar,
    normalizarTitulo,
    nomeArquivo,
  } = useColorir();
  const canvas = useRef(null),
    dados = useRef(null),
    traco = useRef(null),
    quadro = useRef(null);
  const ativo = useRef(false),
    fila = useRef(Promise.resolve(true)),
    revisao = useRef(0),
    salva = useRef(0);
  const salvarAoSair = useRef(true);
  const [carregando, setCarregando] = useState(true),
    [erro, setErro] = useState(""),
    [aviso, setAviso] = useState("");
  const [cor, setCor] = useState("#497be8"),
    [ferramenta, setFerramenta] = useState("preencher");
  const [alteracao, setAlteracao] = useState(0),
    [status, setStatus] = useState(""),
    [ocupado, setOcupado] = useState(false);
  const [tentativa, setTentativa] = useState(0),
    [titulo, setTitulo] = useState(tituloPadrao);
  const padrao = useRef(tituloPadrao);

  const desenhar = useCallback(() => {
    if (!dados.current || !canvas.current) return;
    exibir(canvas.current, dados.current.imagem, dados.current.pixels);
  }, [exibir]);
  const agendarDesenho = useCallback(() => {
    if (quadro.current !== null) return;
    quadro.current = requestAnimationFrame(() => {
      quadro.current = null;
      desenhar();
    });
  }, [desenhar]);
  const guardar = useCallback(
    (silencioso = false) => {
      if (
        !dados.current ||
        !canvas.current ||
        traco.current ||
        revisao.current === salva.current
      )
        return fila.current;
      desenhar();
      const numero = revisao.current,
        acoes = dados.current.acoes.map((acao) => ({
          ...acao,
          versaoMascara: acao.versaoMascara ?? dados.current.mapa.versao ?? 1,
        }));
      const pendente = salvar(
        pagina.id,
        acoes,
        canvas.current,
        dados.current.titulo,
      );
      if (!silencioso && ativo.current) setStatus("Salvando sua pintura…");
      fila.current = pendente
        .then(() => {
          salva.current = Math.max(salva.current, numero);
          if (ativo.current && revisao.current === numero)
            setStatus("Pintura salva neste aparelho!");
          return true;
        })
        .catch(() => {
          if (ativo.current)
            setStatus(
              "Não foi possível salvar. Tente novamente ou baixe sua pintura.",
            );
          return false;
        });
      return fila.current;
    },
    [desenhar, pagina.id, salvar],
  );
  const concluirTraco = useCallback(() => {
    if (!traco.current || !dados.current) return false;
    delete traco.current.pointerId;
    dados.current.acoes.push(traco.current);
    revisao.current++;
    traco.current = null;
    return true;
  }, []);

  useEffect(() => {
    ativo.current = true;
    salvarAoSair.current = true;
    const controller = new AbortController();
    setCarregando(true);
    setErro("");
    abrirDesenho(pagina, controller.signal)
      .then((resultado) => {
        if (controller.signal.aborted) {
          resultado.imagem.close();
          return;
        }
        resultado.titulo = resultado.titulo || padrao.current;
        dados.current = resultado;
        setTitulo(resultado.titulo);
        setAviso(resultado.aviso);
        setCarregando(false);
        setAlteracao((n) => n + 1);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setErro("Não foi possível abrir o desenho. Tente novamente.");
          setCarregando(false);
        }
      });
    return () => {
      ativo.current = false;
      controller.abort();
      concluirTraco();
      if (salvarAoSair.current) guardar(true);
      if (quadro.current !== null) cancelAnimationFrame(quadro.current);
      quadro.current = null;
      dados.current?.imagem.close();
      dados.current = null;
    };
  }, [pagina, abrirDesenho, guardar, tentativa, concluirTraco]);

  useEffect(() => {
    if (!carregando) desenhar();
  }, [carregando, alteracao, desenhar]);

  useEffect(() => {
    if (!alteracao || carregando) return undefined;
    const timer = setTimeout(() => guardar(true), 1000);
    return () => clearTimeout(timer);
  }, [alteracao, carregando, guardar]);

  useEffect(() => {
    const aoOcultar = () => {
      if (document.visibilityState === "hidden") guardar(true);
    };
    const aoSair = () => guardar(true);
    document.addEventListener("visibilitychange", aoOcultar);
    window.addEventListener("pagehide", aoSair);
    return () => {
      document.removeEventListener("visibilitychange", aoOcultar);
      window.removeEventListener("pagehide", aoSair);
    };
  }, [guardar]);

  function registrar(acao) {
    dados.current.acoes.push(acao);
    revisao.current++;
    setStatus("Alterações ainda não salvas.");
    setAlteracao((n) => n + 1);
  }

  function ponto(evento) {
    const rect = canvas.current.getBoundingClientRect();
    return [
      Math.max(
        0,
        Math.min(1199, ((evento.clientX - rect.left) * 1200) / rect.width),
      ),
      Math.max(
        0,
        Math.min(799, ((evento.clientY - rect.top) * 800) / rect.height),
      ),
    ];
  }

  function iniciar(evento) {
    if (
      !dados.current ||
      evento.button !== 0 ||
      evento.isPrimary === false ||
      traco.current
    )
      return;
    const p = ponto(evento),
      id = regiao(dados.current.mapa, ...p);
    if (!id) return;
    evento.preventDefault();
    const acao = {
      tipo: ferramenta,
      cor,
      regiao: id,
      versaoMascara: dados.current.mapa.versao || 1,
    };
    if (ferramenta === "pincel") {
      acao.raio = 18;
      acao.pontos = [p];
      traco.current = acao;
      traco.current.pointerId = evento.pointerId;
      setOcupado(true);
      evento.currentTarget.setPointerCapture(evento.pointerId);
    }
    aplicar(dados.current.pixels, dados.current.mapa, acao);
    if (ferramenta === "preencher") registrar(acao);
    agendarDesenho();
  }

  function mover(evento) {
    if (
      !traco.current ||
      !dados.current ||
      evento.pointerId !== traco.current.pointerId
    )
      return;
    const p = ponto(evento),
      anterior = traco.current.pontos.at(-1);
    aplicar(dados.current.pixels, dados.current.mapa, {
      ...traco.current,
      pontos: [anterior, p],
    });
    traco.current.pontos.push(p);
    agendarDesenho();
  }

  function terminar(evento) {
    if (
      !traco.current ||
      (evento && evento.pointerId !== traco.current.pointerId)
    )
      return;
    concluirTraco();
    setOcupado(false);
    setStatus("Alterações ainda não salvas.");
    setAlteracao((n) => n + 1);
  }

  function desfazer() {
    if (!dados.current?.acoes.length || traco.current) return;
    dados.current.acoes.pop();
    dados.current.pixels = restaurar(dados.current.mapa, dados.current.acoes);
    revisao.current++;
    setStatus("Alterações ainda não salvas.");
    setAlteracao((n) => n + 1);
  }

  function limpar() {
    if (!dados.current || traco.current) return;
    dados.current.acoes = [];
    dados.current.pixels = restaurar(dados.current.mapa, []);
    revisao.current++;
    setStatus("Alterações ainda não salvas.");
    setAlteracao((n) => n + 1);
  }

  async function download() {
    if (!dados.current) return;
    desenhar();
    try {
      await baixar(canvas.current, nomeArquivo(dados.current.titulo));
    } catch {
      if (ativo.current)
        setStatus("Não foi possível baixar a pintura. Tente novamente.");
    }
  }

  function renomear(valor) {
    const novo = normalizarTitulo(valor);
    if (!novo || !dados.current || traco.current) return false;
    if (novo !== dados.current.titulo) {
      dados.current.titulo = novo;
      setTitulo(novo);
      revisao.current++;
      setStatus("Alterações ainda não salvas.");
      setAlteracao((n) => n + 1);
    }
    return true;
  }

  return {
    canvas,
    carregando,
    erro,
    aviso,
    cor,
    setCor,
    ferramenta,
    setFerramenta,
    status,
    ocupado,
    iniciar,
    mover,
    terminar,
    desfazer,
    limpar,
    guardar,
    download,
    podeDesfazer: Boolean(dados.current?.acoes.length),
    titulo,
    renomear,
    descartarAoSair: () => {
      salvarAoSair.current = false;
    },
    tentarNovamente: () => setTentativa((n) => n + 1),
  };
}
