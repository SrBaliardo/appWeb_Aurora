import { useEffect, useRef, useState } from "react";

const seletor =
  "[data-rolagem-bosque], .MuiDialog-paper, .MuiDialogContent-root";
const atributoX = "data-rolagem-bosque-x",
  atributoY = "data-rolagem-bosque-y";

export function useRolagensBosque() {
  const [barras, setBarras] = useState([]);
  const alterar = useRef(() => {});

  useEffect(() => {
    const raiz = document.scrollingElement || document.documentElement;
    const espacoAnterior = document.documentElement.style.getPropertyValue(
      "--altura-cabecalho-bosque",
    );
    const registros = new Map();
    let sequencia = 0,
      quadro = null,
      pausa = null,
      ativo = true;
    let cabecalhoObservado = null,
      trilhoObservado = null;
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(agendar) : null;
    observer?.observe(document.body);
    observer?.observe(raiz);
    function marcar(elemento, atributo, habilitado) {
      if (elemento.hasAttribute(atributo) !== habilitado)
        elemento.toggleAttribute(atributo, habilitado);
    }

    function limpar(elemento) {
      elemento.removeAttribute(atributoX);
      elemento.removeAttribute(atributoY);
      if (elemento !== raiz) observer?.unobserve(elemento);
      registros.delete(elemento);
    }

    function medir() {
      if (!ativo) return;
      const alvos = new Set([raiz, ...document.querySelectorAll(seletor)]),
        proximas = [];
      const altura = window.innerHeight,
        largura = document.documentElement.clientWidth,
        agora = Date.now();
      const cabecalho = document.querySelector("[data-cabecalho-bosque]"),
        trilhoMenu = document.querySelector("[data-trilho-menu]");
      const medidasCabecalho = cabecalho?.getBoundingClientRect();
      const espacoCabecalho = `${Math.max(0, medidasCabecalho?.height || medidasCabecalho?.bottom || 0)}px`;
      if (
        document.documentElement.style.getPropertyValue(
          "--altura-cabecalho-bosque",
        ) !== espacoCabecalho
      )
        document.documentElement.style.setProperty(
          "--altura-cabecalho-bosque",
          espacoCabecalho,
        );
      if (cabecalho !== cabecalhoObservado) {
        if (cabecalhoObservado) observer?.unobserve(cabecalhoObservado);
        if (cabecalho) observer?.observe(cabecalho);
        cabecalhoObservado = cabecalho;
      }
      if (trilhoMenu !== trilhoObservado) {
        if (trilhoObservado) observer?.unobserve(trilhoObservado);
        if (trilhoMenu) observer?.observe(trilhoMenu);
        trilhoObservado = trilhoMenu;
      }
      const inicioPagina = Math.max(
        0,
        Math.min(
          altura,
          (trilhoMenu || cabecalho)?.getBoundingClientRect().bottom || 0,
        ),
      );
      const estiloCorpo = window.getComputedStyle(document.body);
      for (const alvo of registros.keys()) if (!alvos.has(alvo)) limpar(alvo);
      for (const alvo of alvos) {
        const pagina = alvo === raiz;
        if (
          !pagina &&
          (!alvo.isConnected || alvo.closest('[aria-hidden="true"], [inert]'))
        ) {
          limpar(alvo);
          continue;
        }
        const estilo = window.getComputedStyle(alvo);
        const retangulo = pagina
          ? { top: inicioPagina, left: 0, right: largura, bottom: altura }
          : alvo.getBoundingClientRect();
        const bloqueado =
          pagina &&
          /hidden|clip/.test(
            `${estiloCorpo.overflow} ${estiloCorpo.overflowY} ${estilo.overflowY}`,
          );
        if (
          bloqueado ||
          estilo.visibility === "hidden" ||
          estilo.display === "none" ||
          retangulo.bottom <= retangulo.top ||
          retangulo.right <= retangulo.left
        ) {
          limpar(alvo);
          continue;
        }
        if (!registros.has(alvo)) {
          registros.set(alvo, {
            id: ++sequencia,
            x: alvo.scrollLeft,
            y: alvo.scrollTop,
            direcaoX: 1,
            direcaoY: 1,
            ateX: 0,
            ateY: 0,
          });
          if (!pagina) observer?.observe(alvo);
        }
        const registro = registros.get(alvo);
        const limiteX = Math.max(0, alvo.scrollWidth - alvo.clientWidth),
          limiteY = Math.max(0, alvo.scrollHeight - alvo.clientHeight);
        const horizontal =
          limiteX > 1 &&
          (pagina || /auto|scroll|overlay/.test(estilo.overflowX));
        const vertical =
          limiteY > 1 &&
          (pagina || /auto|scroll|overlay/.test(estilo.overflowY));
        marcar(alvo, atributoX, horizontal);
        marcar(alvo, atributoY, vertical);
        const topo = Math.max(0, retangulo.top),
          esquerda = Math.max(0, retangulo.left);
        const direita = Math.min(largura, retangulo.right),
          fundo = Math.min(altura, retangulo.bottom);
        const portal = pagina
          ? document.body
          : alvo.closest(".MuiDialog-paper") || document.body;
        const rotulo =
          alvo.getAttribute("aria-label") ||
          document.getElementById(alvo.getAttribute("aria-labelledby"))
            ?.textContent ||
          "";
        for (const eixo of ["x", "y"]) {
          const y = eixo === "y",
            limite = y ? limiteY : limiteX;
          const posicao = Math.max(
            0,
            Math.min(limite, y ? alvo.scrollTop : alvo.scrollLeft),
          );
          const direcao = y ? "direcaoY" : "direcaoX",
            ate = y ? "ateY" : "ateX";
          if (Math.abs(posicao - registro[eixo]) > 0.1) {
            registro[direcao] = posicao > registro[eixo] ? 1 : -1;
            registro[ate] = agora + 150;
          }
          registro[eixo] = posicao;
          if (
            !(y ? vertical : horizontal) ||
            direita <= esquerda ||
            fundo <= topo
          )
            continue;
          const comprimento = Math.max(
            0,
            (y ? fundo - topo : direita - esquerda) -
              ((y ? horizontal : vertical) ? 44 : 0),
          );
          if (comprimento < 44) continue;
          proximas.push({
            id: `${registro.id}-${eixo}`,
            alvo,
            portal,
            rotulo,
            pagina,
            vertical: y,
            top: y ? topo : fundo - 44,
            left: y ? direita - 44 : esquerda,
            comprimento,
            prolongamento: pagina && y && trilhoMenu ? 20 : 0,
            progresso: limite ? posicao / limite : 0,
            direcao: registro[direcao],
            andando: registro[ate] > agora,
          });
        }
      }
      setBarras((atuais) =>
        atuais.length === proximas.length &&
        atuais.every((barra, i) =>
          Object.keys(barra).every(
            (chave) => barra[chave] === proximas[i][chave],
          ),
        )
          ? atuais
          : proximas,
      );
      window.clearTimeout(pausa);
      const restantes = [...registros.values()]
        .flatMap((r) => [r.ateX, r.ateY])
        .filter((ate) => ate > agora);
      pausa = restantes.length
        ? window.setTimeout(agendar, Math.min(...restantes) - agora + 1)
        : null;
    }

    function agendar() {
      if (ativo && quadro === null)
        quadro = window.requestAnimationFrame(() => {
          quadro = null;
          medir();
        });
    }
    alterar.current = (alvo, vertical, entrada) => {
      const valor = Number(entrada);
      if (!ativo || !Number.isFinite(valor) || !registros.has(alvo)) return;
      const maximo = Math.max(
        0,
        vertical
          ? alvo.scrollHeight - alvo.clientHeight
          : alvo.scrollWidth - alvo.clientWidth,
      );
      const posicao = (maximo * Math.max(0, Math.min(100, valor))) / 100;
      const destino = {
        top: vertical ? posicao : alvo.scrollTop,
        left: vertical ? alvo.scrollLeft : posicao,
        behavior: "instant",
      };
      if (alvo.scrollTo) alvo.scrollTo(destino);
      else {
        alvo.scrollTop = destino.top;
        alvo.scrollLeft = destino.left;
      }
      medir();
    };
    const mutacoes =
      typeof MutationObserver === "function"
        ? new MutationObserver((eventos) => {
            if (
              eventos.some((evento) => {
                if (evento.target.closest?.("[data-controles-rolagem]"))
                  return false;
                const nos = [...evento.addedNodes, ...evento.removedNodes];
                return (
                  !nos.length ||
                  !nos.every(
                    (no) =>
                      no.nodeType === 1 &&
                      no.matches("[data-controles-rolagem]"),
                  )
                );
              })
            )
              agendar();
          })
        : null;
    mutacoes?.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "class",
        "style",
        "hidden",
        "aria-hidden",
        "inert",
        "open",
        "src",
      ],
    });
    document.addEventListener("scroll", agendar, true);
    document.addEventListener("load", agendar, true);
    document.addEventListener("transitionend", agendar, true);
    document.addEventListener("animationend", agendar, true);
    window.addEventListener("resize", agendar);
    window.visualViewport?.addEventListener("resize", agendar);
    medir();
    return () => {
      ativo = false;
      alterar.current = () => {};
      mutacoes?.disconnect();
      observer?.disconnect();
      document.removeEventListener("scroll", agendar, true);
      document.removeEventListener("load", agendar, true);
      document.removeEventListener("transitionend", agendar, true);
      document.removeEventListener("animationend", agendar, true);
      window.removeEventListener("resize", agendar);
      window.visualViewport?.removeEventListener("resize", agendar);
      if (quadro !== null) window.cancelAnimationFrame(quadro);
      window.clearTimeout(pausa);
      for (const alvo of registros.keys()) {
        alvo.removeAttribute(atributoX);
        alvo.removeAttribute(atributoY);
      }
      if (espacoAnterior)
        document.documentElement.style.setProperty(
          "--altura-cabecalho-bosque",
          espacoAnterior,
        );
      else
        document.documentElement.style.removeProperty(
          "--altura-cabecalho-bosque",
        );
    };
  }, []);

  return {
    barras,
    mover: (alvo, vertical, valor) => alterar.current(alvo, vertical, valor),
  };
}
