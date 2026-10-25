import { LIMITE_TITULO } from "./constantes.js";

export function normalizarTitulo(titulo) {
  return typeof titulo === "string"
    ? Array.from(titulo.normalize("NFC"))
        .filter(
          (letra) => letra.charCodeAt(0) >= 32 && letra.charCodeAt(0) !== 127,
        )
        .join("")
        .trim()
        .slice(0, 60)
    : "";
}

export function normalizarTituloEditado(titulo) {
  return normalizarTitulo(titulo).slice(0, LIMITE_TITULO);
}

export function regiaoNoPonto(mapa, x, y) {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    x < 0 ||
    y < 0 ||
    x >= mapa.largura ||
    y >= mapa.altura
  )
    return 0;
  return mapa.regioes[Math.floor(y) * mapa.largura + Math.floor(x)];
}

export function criarPapel(mapa) {
  return new Uint8ClampedArray(mapa.largura * mapa.altura * 4).fill(255);
}

function colorirPixel(pixels, indice, rgb) {
  pixels[indice * 4] = rgb[0];
  pixels[indice * 4 + 1] = rgb[1];
  pixels[indice * 4 + 2] = rgb[2];
}

export function aplicarAcao(pixels, mapa, acao) {
  const alvo =
    acao.versaoMascara === 1
      ? mapa.legado || (mapa.versao !== 2 ? mapa : null)
      : mapa;
  if (!alvo || !acao.regiao || !alvo.indices.has(acao.regiao)) return;
  const cor = parseInt(acao.cor.slice(1), 16),
    rgb = [cor >> 16, (cor >> 8) & 255, cor & 255];
  if (acao.tipo === "preencher") {
    for (const i of alvo.indices.get(acao.regiao)) colorirPixel(pixels, i, rgb);
    return;
  }
  const pintarDisco = (cx, cy) => {
    for (
      let y = Math.max(0, Math.floor(cy - acao.raio));
      y <= Math.min(alvo.altura - 1, Math.ceil(cy + acao.raio));
      y++
    ) {
      for (
        let x = Math.max(0, Math.floor(cx - acao.raio));
        x <= Math.min(alvo.largura - 1, Math.ceil(cx + acao.raio));
        x++
      ) {
        const i = y * alvo.largura + x;
        if (
          (alvo.cobertura || alvo.regioes)[i] === acao.regiao &&
          (x - cx) ** 2 + (y - cy) ** 2 <= acao.raio ** 2
        )
          colorirPixel(pixels, i, rgb);
      }
    }
  };

  for (let i = 0; i < acao.pontos.length; i++) {
    const atual = acao.pontos[i],
      anterior = acao.pontos[i - 1] || atual;
    const passos = Math.max(
      1,
      Math.ceil(Math.hypot(atual[0] - anterior[0], atual[1] - anterior[1]) / 6),
    );

    for (let j = 0; j <= passos; j++)
      pintarDisco(
        anterior[0] + ((atual[0] - anterior[0]) * j) / passos,
        anterior[1] + ((atual[1] - anterior[1]) * j) / passos,
      );
  }
}

export function restaurarPintura(mapa, acoes) {
  const pixels = criarPapel(mapa);
  for (const acao of acoes) aplicarAcao(pixels, mapa, acao);
  return pixels;
}
