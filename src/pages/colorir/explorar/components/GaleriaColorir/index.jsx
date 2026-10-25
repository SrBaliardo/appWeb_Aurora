import { useInterface } from "../../../../../contexts/interface/index.js";
import { useGaleriaColorir } from "../../hooks/useGaleriaColorir.js";
import * as S from "./styles";

export default function GaleriaColorir({ livro, escolher, voltar }) {
  const { t } = useInterface(),
    { pinturas, aviso } = useGaleriaColorir();

  return (
    <>
      <S.Cabecalho>
        <S.Voltar onClick={voltar}>{t("← Voltar à coleção")}</S.Voltar>
        <h1 tabIndex={-1}>{t("Qual desenho vamos colorir?")}</h1>
        <p lang={livro.idioma}>Aurora Goodies · {livro.titulo}</p>
      </S.Cabecalho>

      {aviso && <p role="alert">{t(aviso)}</p>}

      <S.Grade>
        {livro.paginas.map((pagina) => (
          <S.Desenho
            key={pagina.id}
            onClick={() => escolher(pagina)}
            aria-label={
              pinturas[pagina.id]?.titulo ||
              t(
                pinturas[pagina.id]?.iniciada
                  ? "Continuar desenho {numero}"
                  : "Colorir desenho {numero}",
                { numero: pagina.numero },
              )
            }
          >
            <img
              loading="lazy"
              src={pinturas[pagina.id]?.url || pagina.miniatura}
              alt=""
            />
            <strong>
              {pinturas[pagina.id]?.titulo ||
                t("Desenho {numero}", { numero: pagina.numero })}
            </strong>
            <span>
              {t(
                pinturas[pagina.id]?.iniciada
                  ? "Continuar colorindo"
                  : "Vamos colorir!",
              )}
            </span>
          </S.Desenho>
        ))}
      </S.Grade>
    </>
  );
}
