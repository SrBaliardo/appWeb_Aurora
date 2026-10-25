import { useInterface } from "../../../../../contexts/interface/index.js";
import { useArrastarItem } from "../../../../../hooks/useArrastarItem.js";
import CartaoArrastavel from "../../../../../components/CartaoArrastavel/index.jsx";
import FiguraArrastada from "../../../../../components/FiguraArrastada/index.jsx";
import * as S from "./styles";

export default function LinhaTempo({ partida }) {
  const { t } = useInterface();
  const gestos = useArrastarItem({
    aoSoltar: partida.colocar,
    aoSelecionar: partida.selecionar,
  });
  const arrastada = partida.rodada.cenas.find(
    (cena) => cena.id === gestos.arrasto?.id,
  );
  return (
    <S.Area>
      <S.Linha
        $total={partida.rodada.cenas.length}
        role="group"
        aria-label={t("Coloque a história em ordem, começando pelo número um.")}
      >
        {partida.rodada.cenas.map((_cena, indice) => {
          const cena = partida.rodada.cenas.find(
            (item) => item.id === partida.ordem[indice],
          );
          const estado =
            cena && partida.resultados[indice] !== undefined
              ? t(
                  partida.resultados[indice]
                    ? "Cena na ordem correta."
                    : "Cena fora de ordem.",
                )
              : "";
          return (
            <S.Espaco
              key={indice}
              type="button"
              data-destino={indice}
              $ocupado={Boolean(cena)}
              $arrastando={cena && gestos.arrasto?.id === cena.id}
              $resultado={cena ? partida.resultados[indice] : undefined}
              $sobre={gestos.arrasto?.destino === String(indice)}
              disabled={partida.venceu}
              onPointerDown={
                cena && !partida.venceu
                  ? (evento) => gestos.iniciar(evento, cena.id)
                  : undefined
              }
              onPointerMove={gestos.mover}
              onPointerUp={gestos.terminar}
              onPointerCancel={gestos.cancelar}
              onLostPointerCapture={gestos.cancelar}
              onClick={(evento) =>
                gestos.clicar(cena?.id, evento, () =>
                  partida.escolherEspaco(indice),
                )
              }
              aria-label={`${t("Cena {numero}: {texto}", { numero: indice + 1, texto: cena ? t(cena.texto) : t("espaço vazio") })} ${estado}`}
            >
              <S.Numero>{indice + 1}</S.Numero>
              <S.Figura aria-hidden="true">{cena?.figura || "＋"}</S.Figura>
              <span>{cena ? t(cena.texto) : t("Coloque uma cena aqui")}</span>
            </S.Espaco>
          );
        })}
      </S.Linha>
      {!partida.venceu && (
        <S.Bandeja
          $total={partida.rodada.cenas.length}
          role="group"
          aria-label={t("Cenas para organizar")}
        >
          {partida.rodada.embaralhadas
            .filter((cena) => !partida.ordem.includes(cena.id))
            .map((cena) => (
              <CartaoArrastavel
                key={cena.id}
                id={cena.id}
                figura={cena.figura}
                legenda={t(cena.texto)}
                descricao={t("Selecionar ou arrastar: {nome}", {
                  nome: t(cena.texto),
                })}
                selecionado={partida.selecionada === cena.id}
                gestos={gestos}
              />
            ))}
        </S.Bandeja>
      )}
      {arrastada && (
        <FiguraArrastada arrasto={gestos.arrasto} usarDimensoes>
          <S.PecaVisual>
            <S.Figura>{arrastada.figura}</S.Figura>
            <span>{t(arrastada.texto)}</span>
          </S.PecaVisual>
        </FiguraArrastada>
      )}
    </S.Area>
  );
}
