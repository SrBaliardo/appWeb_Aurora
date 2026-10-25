import { construirCatalogo } from "./builders/catalogo.js";
import {
  construirMapa,
  construirRegistro,
  construirNomeArquivo,
  lerAcoesSalvas,
} from "./builders/pintura.js";
import { LIMITE_TITULO, PALETA } from "./constantes.js";
import {
  aplicarAcao,
  normalizarTitulo,
  normalizarTituloEditado,
  regiaoNoPonto,
  restaurarPintura,
} from "./regras.js";
import * as arquivo from "../../services/colorir/index.js";

const catalogos = Object.fromEntries(
  ["pt-BR", "en-US", "es-ES"].map((idioma) => [
    idioma,
    construirCatalogo(idioma),
  ]),
);
const gravacoes = new Map();
async function abrirDesenho(pagina, signal) {
  let registro,
    acoes = [],
    aviso = "",
    titulo = "";
  try {
    await gravacoes.get(pagina.id);
    registro = await arquivo.carregarPintura(pagina.id);
  } catch {
    aviso =
      "Não foi possível recuperar o progresso salvo. Você ainda pode colorir e baixar sua pintura.";
  }
  const legado =
    registro?.versao === 1 ||
    (Array.isArray(registro?.acoes) &&
      registro.acoes.some((acao) => acao.versaoMascara === 1));
  const dados = await arquivo.carregarDesenho(pagina, signal, { legado });
  let mapa;
  try {
    mapa = construirMapa(
      dados.pixels,
      dados.largura,
      dados.altura,
      dados.cobertura,
    );
    if (dados.legado)
      mapa.legado = construirMapa(dados.legado, dados.largura, dados.altura);
  } catch (erro) {
    dados.imagem.close();
    throw erro;
  }
  try {
    acoes = lerAcoesSalvas(registro, mapa);
    titulo = normalizarTitulo(registro?.titulo);
  } catch {
    aviso =
      "Não foi possível recuperar o progresso salvo. Você ainda pode colorir e baixar sua pintura.";
  }
  return {
    imagem: dados.imagem,
    mapa,
    acoes,
    titulo,
    aviso,
    pixels: restaurarPintura(mapa, acoes),
  };
}

function salvar(id, acoes, canvas, titulo = "") {
  const captura = arquivo.capturarMiniatura(canvas).then(
    (miniatura) => ({
      registro: construirRegistro(id, acoes, miniatura, titulo),
    }),
    () => ({ erro: true }),
  );
  const pendente = (gravacoes.get(id) || Promise.resolve())
    .catch(() => {})
    .then(async () => {
      const resultado = await captura;
      if (resultado.erro) throw new Error("Falha ao capturar pintura.");
      await arquivo.salvarPintura(resultado.registro);
    });
  gravacoes.set(id, pendente);
  const limpar = () => {
    if (gravacoes.get(id) === pendente) gravacoes.delete(id);
  };
  pendente.then(limpar, limpar);
  return pendente;
}

export function useColorir(idioma = "pt-BR") {
  const livros = catalogos[idioma] || catalogos["pt-BR"];
  return {
    livros,
    livroGratuito: livros[0],
    paleta: PALETA,
    abrirDesenho,
    salvar,
    listar: arquivo.listarPinturas,
    exibir: arquivo.exibirPintura,
    baixar: arquivo.baixarPintura,
    aplicar: aplicarAcao,
    regiao: regiaoNoPonto,
    restaurar: restaurarPintura,
    normalizarTitulo: normalizarTituloEditado,
    limiteTitulo: LIMITE_TITULO,
    nomeArquivo: construirNomeArquivo,
  };
}
