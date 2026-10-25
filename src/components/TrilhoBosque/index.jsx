import { useId } from "react";
import Planta from "./Planta.jsx";
import Inseto from "./Inseto.jsx";
import * as S from "./styles";

export default function TrilhoBosque({
  vertical = false,
  comprimento,
  prolongamento = 0,
  menu = false,
  telaInteira = false,
  progresso,
  direcao,
  andando,
  mover,
  rotulo,
  descricao,
  valorAcessivel,
  controleId,
}) {
  const id = useId().replace(/:/g, "");

  function teclado(evento) {
    const passos = {
      ArrowDown: 1,
      ArrowUp: -1,
      ArrowRight: 1,
      ArrowLeft: -1,
      PageDown: 10,
      PageUp: -10,
    };

    if (!(evento.key in passos) && !["Home", "End"].includes(evento.key))
      return;
    evento.stopPropagation();

    if (!vertical) return;
    evento.preventDefault();

    const valor =
      evento.key === "Home"
        ? 0
        : evento.key === "End"
          ? 100
          : Math.max(0, Math.min(100, progresso * 100 + passos[evento.key]));
    mover({ currentTarget: { value: String(valor) } });
  }

  return (
    <S.Trilha
      data-trilho-menu={menu ? "" : undefined}
      $vertical={vertical}
      $comprimento={comprimento}
    >
      <S.Decoracao
        aria-hidden="true"
        $vertical={vertical}
        $telaInteira={telaInteira}
        $prolongamento={prolongamento}
      >
        <Planta
          id={id}
          vertical={vertical}
          comprimento={vertical ? comprimento + prolongamento : comprimento}
        />
      </S.Decoracao>

      <S.Mecanismo $vertical={vertical}>
        <S.Controle
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progresso * 100}
          onChange={mover}
          onKeyDown={teclado}
          $vertical={vertical}
          $comprimento={comprimento}
          aria-orientation={vertical ? "vertical" : "horizontal"}
          aria-label={rotulo}
          aria-controls={controleId}
          aria-valuetext={valorAcessivel}
          title={descricao}
        />

        <S.Caminho aria-hidden="true" $vertical={vertical}>
          <S.Inseto
            $vertical={vertical}
            $progresso={progresso}
            $direcao={direcao}
            $andando={andando}
          >
            <Inseto id={id} />
          </S.Inseto>
        </S.Caminho>
      </S.Mecanismo>
    </S.Trilha>
  );
}
