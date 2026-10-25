import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { useInterface } from "../../../../../contexts/interface/index.js";
import { useColorir } from "../../../../../contexts/colorir/index.js";
import Icone from "../../../../../components/Icone/index.jsx";
import Carregamento from "../../../../../components/Carregamento/index.jsx";
import { usePintura } from "../../hooks/usePintura.js";
import { useEdicaoTitulo } from "../../hooks/useEdicaoTitulo.js";
import { useMolduraColorir } from "../../hooks/useMolduraColorir.js";
import { useSaidaPintura } from "../../hooks/useSaidaPintura.js";
import * as S from "./styles";

export default function EditorColorir({
  pagina,
  voltar,
  registrarAntesDeNavegar,
}) {
  const { t, idiomaInterface } = useInterface(),
    { paleta, limiteTitulo } = useColorir();
  const jogo = usePintura(
    pagina,
    t("Meu desenho {numero}", { numero: pagina.numero }),
  );
  const titulo = useEdicaoTitulo(
    jogo.titulo,
    jogo.renomear,
    jogo.guardar,
    limiteTitulo,
  );
  const [confirmar, setConfirmar] = useState(false),
    [ampliado, setAmpliado] = useState(false);
  const { palco, largura } = useMolduraColorir(ampliado);
  const indisponivel = jogo.carregando || jogo.ocupado || Boolean(jogo.erro);
  const mensagem = t(
    titulo.invalido
      ? "Escreva um título para o desenho."
      : jogo.erro || jogo.status || jogo.aviso,
  );
  const saida = useSaidaPintura(
    jogo.guardar,
    voltar,
    jogo.ocupado,
    jogo.descartarAoSair,
    registrarAntesDeNavegar,
  );

  return (
    <S.Enquadramento aria-labelledby="titulo-pintura">
      <S.Editor
        inert={saida.salvando ? "" : undefined}
        aria-busy={saida.salvando}
      >
        <S.Cabecalho>
          <S.Voltar
            onClick={saida.sair}
            disabled={jogo.ocupado || saida.salvando}
            aria-label={t("Voltar aos desenhos")}
          >
            <Icone nome="voltar" />
            <span>{t("Voltar aos desenhos")}</span>
          </S.Voltar>

          <S.Titulo>
            <h1
              id="titulo-pintura"
              tabIndex={-1}
              hidden={titulo.editando}
              title={jogo.titulo}
            >
              {jogo.titulo}
            </h1>

            {titulo.editando ? (
              <S.Edicao onSubmit={titulo.confirmar}>
                <S.Campo
                  ref={titulo.campo}
                  $largura={titulo.largura}
                  autoFocus
                  aria-label={t("Título do desenho")}
                  aria-invalid={titulo.invalido}
                  placeholder={t("Título do desenho")}
                  value={titulo.rascunho}
                  maxLength={limiteTitulo}
                  onChange={titulo.alterar}
                  onKeyDown={titulo.teclado}
                />

                <S.AcaoTitulo
                  $acao="cancelar"
                  type="button"
                  onClick={titulo.cancelar}
                  aria-label={t("Cancelar edição")}
                  title={t("Cancelar edição")}
                >
                  <Icone nome="fechar" tamanho={32} />
                </S.AcaoTitulo>

                <S.AcaoTitulo
                  $acao="confirmar"
                  type="submit"
                  aria-label={t("Confirmar título")}
                  title={t("Confirmar título")}
                >
                  <Icone nome="check" tamanho={32} />
                </S.AcaoTitulo>
              </S.Edicao>
            ) : (
              <S.AcaoTitulo
                ref={titulo.lapis}
                disabled={indisponivel}
                onClick={titulo.editar}
                aria-label={t("Editar título")}
                title={t("Editar título")}
              >
                <Icone nome="lapis" tamanho={32} />
              </S.AcaoTitulo>
            )}
          </S.Titulo>
        </S.Cabecalho>

        <S.Instrucao $oculta={ampliado}>
          {t(
            "Escolha uma cor. Toque para preencher ou use o pincel: ele fica dentro da região onde você começou!",
          )}
        </S.Instrucao>

        <S.Area aria-busy={jogo.carregando}>
          <S.Desenho>
            <S.Palco ref={palco}>
              <S.Papel $largura={largura}>
                <S.Canvas
                  ref={jogo.canvas}
                  width={1200}
                  height={800}
                  aria-label={t("Desenho para colorir")}
                  onPointerDown={jogo.iniciar}
                  onPointerMove={jogo.mover}
                  onPointerUp={jogo.terminar}
                  onPointerCancel={jogo.terminar}
                  onLostPointerCapture={jogo.terminar}
                />
              </S.Papel>
            </S.Palco>

            <S.Acoes>
              <S.Botao
                disabled={indisponivel}
                onClick={jogo.download}
                aria-label={t("Baixar")}
                title={t("Baixar")}
              >
                <Icone nome="baixar" />
                {t("Baixar")}
              </S.Botao>

              <S.Botao
                aria-pressed={ampliado}
                disabled={jogo.ocupado}
                onClick={() => setAmpliado((v) => !v)}
                aria-label={t(ampliado ? "Reduzir" : "Ampliar")}
                title={t(ampliado ? "Reduzir" : "Ampliar")}
              >
                <Icone nome={ampliado ? "reduzir" : "ampliar"} />
                {t(ampliado ? "Reduzir" : "Ampliar")}
              </S.Botao>

              <S.Botao
                disabled={!jogo.podeDesfazer || jogo.ocupado}
                onClick={() => setConfirmar(true)}
                aria-label={t("Recomeçar")}
                title={t("Recomeçar")}
              >
                <Icone nome="reiniciar" />
                {t("Recomeçar")}
              </S.Botao>
            </S.Acoes>
          </S.Desenho>

          <S.Painel aria-label={t("Ferramentas de pintura")}>
            <S.Ferramentas>
              <S.BotaoIcone
                disabled={indisponivel}
                aria-label={t("Preencher")}
                title={t("Preencher")}
                aria-pressed={jogo.ferramenta === "preencher"}
                onClick={() => jogo.setFerramenta("preencher")}
              >
                <Icone nome="balde" tamanho={28} />
              </S.BotaoIcone>

              <S.BotaoIcone
                disabled={indisponivel}
                aria-label={t("Pincel")}
                title={t("Pincel")}
                aria-pressed={jogo.ferramenta === "pincel"}
                onClick={() => jogo.setFerramenta("pincel")}
              >
                <Icone nome="pincel" tamanho={28} />
              </S.BotaoIcone>
            </S.Ferramentas>

            <S.Paleta data-rolagem-bosque="" aria-label={t("Paleta de cores")}>
              {paleta.map(([cor, nome]) => (
                <S.Cor
                  key={cor}
                  $cor={cor}
                  $ativa={cor === jogo.cor}
                  aria-label={t(nome)}
                  title={t(nome)}
                  aria-pressed={cor === jogo.cor}
                  disabled={jogo.ocupado}
                  onClick={() => jogo.setCor(cor)}
                >
                  {cor === jogo.cor ? "✓" : ""}
                </S.Cor>
              ))}
            </S.Paleta>

            <S.Desfazer
              disabled={!jogo.podeDesfazer || jogo.ocupado}
              onClick={jogo.desfazer}
              title={t("Desfazer")}
            >
              <Icone nome="desfazer" />
              <span>{t("Desfazer")}</span>
            </S.Desfazer>
          </S.Painel>

          {jogo.carregando && <Carregamento local idioma={idiomaInterface} />}
        </S.Area>

        <S.Status
          role={jogo.erro || (!jogo.status && jogo.aviso) ? "alert" : "status"}
          aria-live="polite"
          title={mensagem}
        >
          <S.Mensagem>{mensagem}</S.Mensagem>

          {jogo.erro && (
            <S.Botao onClick={jogo.tentarNovamente}>
              {t("Tentar novamente")}
            </S.Botao>
          )}
        </S.Status>
      </S.Editor>

      {saida.salvando && !saida.confirmarSaida && (
        <Carregamento local idioma={idiomaInterface} />
      )}

      <Dialog
        open={confirmar}
        onClose={() => setConfirmar(false)}
        aria-labelledby="confirmar-limpeza"
      >
        <S.Confirmacao>
          <h2 id="confirmar-limpeza">{t("Começar este desenho de novo?")}</h2>
          <p>
            {t(
              "As cores deste desenho serão apagadas, inclusive no progresso salvo.",
            )}
          </p>

          <S.Botao onClick={() => setConfirmar(false)}>
            {t("Continuar colorindo")}
          </S.Botao>

          <S.Botao
            onClick={() => {
              jogo.limpar();
              setConfirmar(false);
            }}
          >
            {t("Sim, começar de novo")}
          </S.Botao>
        </S.Confirmacao>
      </Dialog>

      <Dialog
        open={saida.confirmarSaida}
        onClose={saida.cancelarSaida}
        aria-labelledby="confirmar-saida"
      >
        <S.Confirmacao>
          <h2 id="confirmar-saida">{t("Sua pintura ainda não foi salva.")}</h2>
          <p>
            {t(
              "Você pode tentar salvar novamente, baixar uma cópia ou sair sem salvar as últimas alterações.",
            )}
          </p>

          <S.Botao disabled={saida.salvando} onClick={saida.sair}>
            {t("Tentar salvar e sair")}
          </S.Botao>

          <S.Botao disabled={saida.salvando} onClick={jogo.download}>
            <Icone nome="baixar" />
            {t("Baixar")}
          </S.Botao>

          <S.Botao disabled={saida.salvando} onClick={saida.cancelarSaida}>
            {t("Continuar colorindo")}
          </S.Botao>

          <S.Botao disabled={saida.salvando} onClick={saida.sairSemSalvar}>
            {t("Sair sem salvar")}
          </S.Botao>
        </S.Confirmacao>
      </Dialog>
    </S.Enquadramento>
  );
}
