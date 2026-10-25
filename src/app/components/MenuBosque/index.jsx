import { useId } from "react";
import { useInterface } from "../../../contexts/interface/index.js";
import TrilhoBosque from "../../../components/TrilhoBosque/index.jsx";
import { useRolagemMenu } from "../../hooks/useRolagemMenu.js";
import * as S from "./styles";

export default function MenuBosque({ children }) {
  const { t, idiomaInterface } = useInterface();
  const rolagem = useRolagemMenu(idiomaInterface);
  const id = useId().replace(/:/g, "");

  return (
    <S.Menu>
      <S.Nav
        ref={rolagem.menu}
        aria-label={t("Brincadeiras")}
        id={"menu-" + id}
      >
        <S.Itens ref={rolagem.itens}>{children}</S.Itens>
      </S.Nav>

      {rolagem.visivel && (
        <TrilhoBosque
          {...rolagem}
          menu
          telaInteira
          mover={rolagem.mover}
          rotulo={t("Movimentar o menu")}
          controleId={"menu-" + id}
          valorAcessivel={t("Posi??o do menu: {valor}%", {
            valor: Math.round(rolagem.progresso * 100),
          })}
          descricao={t("Arraste a joaninha para explorar o menu")}
        />
      )}
    </S.Menu>
  );
}
