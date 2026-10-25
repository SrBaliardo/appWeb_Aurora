import { useInterface } from "../../../../../contexts/interface/index.js";
import { useArrastarItem } from "../../../../../hooks/useArrastarItem.js";
import CartaoArrastavel from "../../../../../components/CartaoArrastavel/index.jsx";
import FiguraArrastada from "../../../../../components/FiguraArrastada/index.jsx";
import * as S from "./styles";

export default function Colecoes({ partida }) {
  const { t } = useInterface();
  const gestos = useArrastarItem({
    aoSoltar: partida.colocar,
    aoSelecionar: partida.selecionar,
  });
  const itemArrastado = partida.rodada.itens.find(
    (item) => item.id === gestos.arrasto?.id,
  );

  return (
    <S.Area>
      <S.Grupos
        $quantidade={partida.rodada.grupos.length}
        role="group"
        aria-label={t("Grupos para organizar as figuras")}
      >
        {partida.rodada.grupos.map((grupo) => {
          const resultado =
            gestos.arrasto?.destino === grupo.id
              ? partida.avaliar(gestos.arrasto.id, grupo.id)
              : partida.sinal?.grupo === grupo.id
                ? partida.sinal.resultado
                : null;

          return (
            <S.Grupo
              key={grupo.id}
              type="button"
              data-destino={grupo.id}
              $resultado={resultado}
              disabled={partida.venceu}
              onClick={() =>
                partida.selecionado &&
                partida.colocar(partida.selecionado, grupo.id)
              }
              aria-label={t("Colocar no grupo: {grupo}", {
                grupo: t(grupo.nome),
              })}
            >
              <S.Simbolo aria-hidden="true">{grupo.figura}</S.Simbolo>
              <strong>{t(grupo.nome)}</strong>
              <S.Encontrados>
                {partida.rodada.itens
                  .filter(
                    (item) =>
                      item.grupo === grupo.id &&
                      partida.organizados.includes(item.id),
                  )
                  .map((item) => (
                    <span key={item.id} role="img" aria-label={t(item.nome)}>
                      {item.figura}
                    </span>
                  ))}
              </S.Encontrados>
            </S.Grupo>
          );
        })}
      </S.Grupos>

      <S.Bandeja role="group" aria-label={t("Figuras para organizar")}>
        {partida.rodada.itens
          .filter((item) => !partida.organizados.includes(item.id))
          .map((item) => (
            <CartaoArrastavel
              key={item.id}
              id={item.id}
              figura={item.figura}
              legenda={t(item.nome)}
              descricao={t("Selecionar ou arrastar: {nome}", {
                nome: t(item.nome),
              })}
              selecionado={partida.selecionado === item.id}
              gestos={gestos}
            />
          ))}
      </S.Bandeja>

      <FiguraArrastada arrasto={gestos.arrasto}>
        {itemArrastado?.figura}
      </FiguraArrastada>
    </S.Area>
  );
}
