import { VERSAO_PINTURA } from "../constantes.js";
import { normalizarTitulo } from "../regras.js";

export function construirMapa(pixels, largura, altura, pixelsCobertura) {
  if (
    pixels.length !== largura * altura * 4 ||
    (pixelsCobertura && pixelsCobertura.length !== pixels.length)
  )
    throw new Error("Dimensões de máscara inválidas.");
  const regioes = new Uint32Array(largura * altura);
  const cobertura = pixelsCobertura
    ? new Uint32Array(largura * altura)
    : regioes;
  const indices = new Map();
  for (let i = 0; i < regioes.length; i++) {
    const id =
      pixels[i * 4] + (pixels[i * 4 + 1] << 8) + (pixels[i * 4 + 2] << 16);
    regioes[i] = id;
    const cor = pixelsCobertura;
    const area = cor
      ? cor[i * 4] + (cor[i * 4 + 1] << 8) + (cor[i * 4 + 2] << 16)
      : id;
    cobertura[i] = area;
    if (area) {
      if (!indices.has(area)) indices.set(area, []);
      indices.get(area).push(i);
    }
  }
  return {
    largura,
    altura,
    regioes,
    cobertura,
    indices,
    versao: pixelsCobertura ? 2 : 1,
  };
}

export function construirRegistro(id, acoes, miniatura, titulo = "") {
  return {
    id,
    versao: VERSAO_PINTURA,
    acoes,
    miniatura,
    titulo: normalizarTitulo(titulo),
    atualizadoEm: Date.now(),
  };
}

export function construirNomeArquivo(titulo) {
  const seguro = normalizarTitulo(titulo)
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/[. ]+$/g, "");
  return `aurora_goodies-${seguro || "Meu desenho"}.png`;
}

export function lerAcoesSalvas(registro, mapa) {
  if (!registro) return [];
  if (
    ![1, VERSAO_PINTURA].includes(registro.versao) ||
    !Array.isArray(registro.acoes)
  )
    throw new Error("Pintura salva incompatível.");
  return registro.acoes.map((acao) => {
    const versaoMascara = registro.versao === 1 ? 1 : (acao.versaoMascara ?? 2);
    const alvo =
      versaoMascara === 1
        ? mapa.legado || (mapa.versao === 1 ? mapa : null)
        : mapa;
    if (
      ![1, 2].includes(versaoMascara) ||
      !alvo ||
      !["pincel", "preencher"].includes(acao.tipo) ||
      !/^#[0-9a-f]{6}$/i.test(acao.cor) ||
      !alvo.indices.has(acao.regiao)
    )
      throw new Error("Pintura salva inválida.");
    if (acao.tipo === "preencher")
      return {
        tipo: acao.tipo,
        cor: acao.cor,
        regiao: acao.regiao,
        versaoMascara,
      };
    if (
      !Array.isArray(acao.pontos) ||
      !acao.pontos.length ||
      acao.raio !== 18 ||
      !acao.pontos.every(
        (p) =>
          Array.isArray(p) &&
          p.length === 2 &&
          p.every(Number.isFinite) &&
          p[0] >= 0 &&
          p[0] < alvo.largura &&
          p[1] >= 0 &&
          p[1] < alvo.altura,
      )
    )
      throw new Error("Traço salvo inválido.");
    return {
      tipo: acao.tipo,
      cor: acao.cor,
      regiao: acao.regiao,
      versaoMascara,
      raio: 18,
      pontos: acao.pontos.map((p) => [...p]),
    };
  });
}
