import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { createHash } from "node:crypto";
import { construirCatalogo } from "../src/contexts/colorir/builders/catalogo.js";
import {
  construirMapa,
  construirNomeArquivo,
  construirRegistro,
  lerAcoesSalvas,
} from "../src/contexts/colorir/builders/pintura.js";
import {
  aplicarAcao,
  criarPapel,
  normalizarTituloEditado,
  regiaoNoPonto,
  restaurarPintura,
} from "../src/contexts/colorir/regras.js";
import { PALETA } from "../src/contexts/colorir/constantes.js";
import en from "../src/contexts/interface/mensagens/en-US.js";
import es from "../src/contexts/interface/mensagens/es-ES.js";

function mapaSimples() {
  return construirMapa(
    new Uint8ClampedArray([
      1, 0, 0, 255, 1, 0, 0, 255, 0, 0, 0, 255, 2, 0, 0, 255, 2, 0, 0, 255,
    ]),
    5,
    1,
  );
}
test("preenchimento e pincel respeitam a região inicial, inclusive ao atravessar outra região e contornos", () => {
  const mapa = mapaSimples(),
    papel = criarPapel(mapa);
  aplicarAcao(papel, mapa, {
    tipo: "pincel",
    cor: "#ff0000",
    regiao: 1,
    raio: 18,
    pontos: [
      [0, 0],
      [4, 0],
    ],
  });
  assert.deepEqual(
    [...papel],
    [
      255, 0, 0, 255, 255, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255,
      255, 255, 255, 255,
    ],
  );
  aplicarAcao(papel, mapa, { tipo: "preencher", cor: "#0000ff", regiao: 2 });
  assert.deepEqual([...papel.slice(12)], [0, 0, 255, 255, 0, 0, 255, 255]);
  for (const p of [
    [-1, 0],
    [0, -1],
    [5, 0],
    [0, 1],
    [NaN, 0],
    [Infinity, 0],
  ])
    assert.equal(regiaoNoPonto(mapa, ...p), 0);
  assert.equal(regiaoNoPonto(mapa, 2, 0), 0);
});
test("restauração reconstitui sobreposições; desfazer e limpar não deixam tinta residual", () => {
  const mapa = mapaSimples();
  const acoes = [
    { tipo: "preencher", regiao: 1, cor: "#ff0000" },
    { tipo: "preencher", regiao: 1, cor: "#00ff00" },
  ];
  const registro = construirRegistro("bosque-1", acoes, null);
  assert.equal(registro.id, "bosque-1");
  assert.equal(registro.versao, 2);
  const salvas = lerAcoesSalvas(JSON.parse(JSON.stringify(registro)), mapa);
  assert.deepEqual(
    [...restaurarPintura(mapa, salvas).slice(0, 3)],
    [0, 255, 0],
  );
  assert.deepEqual(
    [...restaurarPintura(mapa, salvas.slice(0, -1)).slice(0, 3)],
    [255, 0, 0],
  );
  assert.ok(restaurarPintura(mapa, []).every((v) => v === 255));
});
test("progresso incompatível ou corrompido é rejeitado sem aceitar regiões ou coordenadas indevidas", () => {
  const mapa = mapaSimples();
  for (const registro of [
    { versao: 3, acoes: [] },
    { versao: 1, acoes: {} },
    ...[
      { tipo: "preencher", regiao: 3, cor: "#ff0000" },
      { tipo: "preencher", regiao: 1, cor: "red" },
      {
        tipo: "pincel",
        regiao: 1,
        cor: "#ff0000",
        raio: 900,
        pontos: [[0, 0]],
      },
      { tipo: "pincel", regiao: 1, cor: "#ff0000", raio: 18, pontos: [[5, 0]] },
    ].map((acao) => ({ versao: 1, acoes: [acao] })),
  ])
    assert.throws(() => lerAcoesSalvas(registro, mapa));
});
test("catálogo publica somente os 32 interiores e o PDF gratuito do Bosque, com seis capas", () => {
  const livros = construirCatalogo();
  assert.equal(livros.length, 6);
  assert.equal(livros.filter((l) => l.gratuito).length, 1);
  assert.equal(livros[0].paginas.length, 32);
  for (const livro of livros) {
    assert.ok(existsSync(`public${livro.capa}`));
    if (!livro.gratuito) {
      assert.equal(livro.download, null);
      assert.equal(livro.paginas.length, 0);
    }
    for (const pagina of livro.paginas)
      for (const tipo of [
        "imagem",
        "miniatura",
        "mascara",
        "cobertura",
        "mascaraLegada",
      ])
        assert.ok(existsSync(`public${pagina[tipo]}`));
  }
  const hash = (caminho) =>
    createHash("sha256").update(readFileSync(caminho)).digest("hex");
  assert.equal(
    hash(`public${livros[0].download}`),
    "a9f6fc24dc0e6ef8163dd1350e330bc14ed2508375f9d4d95c050fb043149eaa",
  );
});
// Leitor mínimo de PNG para verificar os mapas reais sem instalar ferramentas.
function lerPNG(caminho) {
  const png = readFileSync(caminho),
    partes = [];
  let largura, altura, canais;
  for (let offset = 8; offset < png.length; ) {
    const tamanho = png.readUInt32BE(offset),
      tipo = png.toString("ascii", offset + 4, offset + 8),
      dados = png.subarray(offset + 8, offset + 8 + tamanho);
    if (tipo === "IHDR") {
      largura = dados.readUInt32BE(0);
      altura = dados.readUInt32BE(4);
      assert.equal(dados[8], 8);
      assert.ok([2, 6].includes(dados[9]));
      canais = dados[9] === 6 ? 4 : 3;
      assert.equal(dados[12], 0);
    }
    if (tipo === "IDAT") partes.push(dados);
    offset += tamanho + 12;
  }
  const bruto = inflateSync(Buffer.concat(partes)),
    stride = largura * canais,
    pixels = new Uint8ClampedArray(largura * altura * 4),
    linhas = new Uint8Array(stride * altura);
  function paeth(a, b, c) {
    const p = a + b - c,
      pa = Math.abs(p - a),
      pb = Math.abs(p - b),
      pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  }
  for (let y = 0; y < altura; y++) {
    const filtro = bruto[y * (stride + 1)];
    assert.ok(filtro <= 4);
    for (let x = 0; x < stride; x++) {
      const a = x >= canais ? linhas[y * stride + x - canais] : 0,
        b = y ? linhas[(y - 1) * stride + x] : 0,
        c = y && x >= canais ? linhas[(y - 1) * stride + x - canais] : 0;
      linhas[y * stride + x] =
        (bruto[y * (stride + 1) + 1 + x] +
          [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filtro]) &
        255;
    }
  }
  for (let i = 0; i < largura * altura; i++) {
    pixels[i * 4] = linhas[i * canais];
    pixels[i * 4 + 1] = linhas[i * canais + 1];
    pixels[i * 4 + 2] = linhas[i * canais + 2];
    pixels[i * 4 + 3] = 255;
  }
  return { pixels, largura, altura };
}
test("máscaras reais do piloto têm dimensões corretas e não deixam tinta atravessar outras regiões", () => {
  for (const numero of ["01", "16", "32"]) {
    const { pixels, largura, altura } = lerPNG(
      `public/colorir/bosque/pagina-${numero}-regioes.png`,
    );
    assert.equal(largura, 1200);
    assert.equal(altura, 800);
    const mapa = construirMapa(pixels, largura, altura),
      papel = criarPapel(mapa);
    assert.ok(mapa.indices.size > 30);
    const id = [...mapa.indices.keys()][10];
    aplicarAcao(papel, mapa, { tipo: "preencher", regiao: id, cor: "#ff0000" });
    let pintados = 0;
    for (let i = 0; i < mapa.regioes.length; i++) {
      if (mapa.regioes[i] === id) {
        assert.equal(papel[i * 4 + 1], 0);
        pintados++;
      } else assert.equal(papel[i * 4 + 1], 255);
    }
    assert.equal(pintados, mapa.indices.get(id).length);
  }
});
test("nomes de todas as cores têm tradução nos dois idiomas", () => {
  for (const [, nome] of PALETA) {
    assert.ok(en[nome], `EN ${nome}`);
    assert.ok(es[nome], `ES ${nome}`);
  }
});
test("título é opcional nos registros antigos e normalizado nos novos; arquivo preserva espaços e acentos com segurança", () => {
  const mapa = mapaSimples();
  assert.deepEqual(lerAcoesSalvas({ versao: 1, acoes: [] }, mapa), []);
  const registro = construirRegistro("bosque-1", [], null, "  Meu desenho 3  ");
  assert.equal(registro.titulo, "Meu desenho 3");
  assert.equal(registro.versao, 2);
  assert.equal(
    construirNomeArquivo(registro.titulo),
    "aurora_goodies-Meu desenho 3.png",
  );
  assert.equal(
    construirNomeArquivo("Aurora: ação/amor?"),
    "aurora_goodies-Aurora- ação-amor-.png",
  );
  assert.ok(!construirNomeArquivo("../pasta\\imagem").includes("/"));
  assert.equal(
    construirRegistro("x", [], null, "a".repeat(80)).titulo.length,
    60,
  );
  assert.equal(normalizarTituloEditado("a".repeat(80)).length, 40);
});

test("cobertura pinta os pixels da borda sem mudar a região escolhida ou permitir atravessar a vizinha", () => {
  const rgba = (ids) =>
    new Uint8ClampedArray(ids.flatMap((id) => [id, 0, 0, 255]));
  const mapa = construirMapa(rgba([1, 0, 0, 2]), 4, 1, rgba([1, 1, 2, 2]));
  assert.equal(regiaoNoPonto(mapa, 1, 0), 0);
  const papel = criarPapel(mapa);
  aplicarAcao(papel, mapa, {
    tipo: "pincel",
    cor: "#ff0000",
    regiao: 1,
    raio: 18,
    pontos: [
      [0, 0],
      [3, 0],
    ],
  });
  assert.deepEqual(
    [...papel],
    [255, 0, 0, 255, 255, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255],
  );
});
test("progresso v1 conserva os pixels originais e pode receber ações v2 sem trocar identificadores", () => {
  const rgba = (ids) =>
    new Uint8ClampedArray(ids.flatMap((id) => [id, 0, 0, 255]));
  const antigo = construirMapa(rgba([1, 1, 0, 1, 2]), 5, 1);
  const atual = construirMapa(
    rgba([10, 10, 0, 20, 20]),
    5,
    1,
    rgba([10, 10, 10, 20, 20]),
  );
  atual.legado = antigo;
  const registro = {
    versao: 1,
    acoes: [{ tipo: "preencher", regiao: 1, cor: "#0000ff" }],
  };
  const convertido = lerAcoesSalvas(registro, atual);
  assert.equal(convertido[0].versaoMascara, 1);
  assert.deepEqual(
    restaurarPintura(atual, convertido),
    restaurarPintura(antigo, registro.acoes),
  );
  const misto = [
    ...convertido,
    { tipo: "preencher", regiao: 10, cor: "#ff0000" },
  ];
  const salvo = construirRegistro("bosque-1", misto, null, "Aurora");
  const reaberto = lerAcoesSalvas(salvo, atual),
    pixels = restaurarPintura(atual, reaberto);
  assert.equal(reaberto[0].versaoMascara, 1);
  assert.equal(reaberto[1].versaoMascara, 2);
  assert.deepEqual([...pixels.slice(0, 3)], [255, 0, 0]);
  assert.deepEqual([...pixels.slice(12, 15)], [0, 0, 255]);
  assert.throws(() =>
    lerAcoesSalvas(registro, { ...atual, legado: undefined }),
  );
  assert.throws(() =>
    lerAcoesSalvas(
      {
        versao: 2,
        acoes: [
          { tipo: "preencher", regiao: 1, cor: "#0000ff", versaoMascara: 3 },
        ],
      },
      atual,
    ),
  );
});
test("todos os 32 mapas novos cobrem a imagem inteira, preservam os arquivos v1 e fecham os vazamentos revisados", () => {
  const relatorio = JSON.parse(
    readFileSync("scripts/colorir/relatorio-v2.json", "utf8").replace(
      /^\uFEFF/,
      "",
    ),
  );
  assert.equal(relatorio.length, 32);
  const verificacoes = {
    8: [
      [
        [1100, 780],
        [1100, 30],
      ],
    ],
    17: [
      [
        [600, 735],
        [1000, 200],
      ],
    ],
    20: [
      [
        [350, 170],
        [650, 150],
      ],
      [
        [700, 750],
        [650, 150],
      ],
    ],
    24: [
      [
        [1100, 780],
        [1100, 30],
      ],
    ],
    28: [
      [
        [1100, 780],
        [1100, 30],
      ],
    ],
  };
  const hash = (caminho) =>
    createHash("sha256")
      .update(readFileSync(caminho))
      .digest("hex")
      .toUpperCase();
  for (const { pagina, arteSHA256, legadoSHA256 } of relatorio) {
    const nome = String(pagina).padStart(2, "0"),
      base = `public/colorir/bosque/pagina-${nome}`;
    assert.equal(hash(`${base}.png`), arteSHA256);
    assert.equal(hash(`${base}-regioes.png`), legadoSHA256);
    const hit = lerPNG(`${base}-v2-regioes.png`),
      cobertura = lerPNG(`${base}-v2-cobertura.png`);
    assert.equal(hit.largura, 1200);
    assert.equal(hit.altura, 800);
    const mapa = construirMapa(hit.pixels, 1200, 800, cobertura.pixels);
    assert.ok(
      mapa.cobertura.every((id) => id > 0),
      `página ${pagina} sem pixels órfãos`,
    );
    for (let i = 0; i < mapa.regioes.length; i++)
      if (mapa.regioes[i]) assert.equal(mapa.cobertura[i], mapa.regioes[i]);
    const papel = criarPapel(mapa);
    for (const regiao of mapa.indices.keys())
      aplicarAcao(papel, mapa, { tipo: "preencher", cor: "#ff0000", regiao });
    for (let i = 0; i < papel.length; i += 4) {
      assert.equal(papel[i], 255);
      assert.equal(papel[i + 1], 0);
      assert.equal(papel[i + 2], 0);
    }
    for (const [a, b] of verificacoes[pagina] || []) {
      const ra = regiaoNoPonto(mapa, ...a),
        rb = regiaoNoPonto(mapa, ...b);
      assert.ok(ra > 0 && rb > 0);
      assert.notEqual(ra, rb, `página ${pagina}: regiões continuam conectadas`);
    }
    if (pagina === 20) {
      const brilho = regiaoNoPonto(mapa, 382, 256),
        rosto = regiaoNoPonto(mapa, 450, 300);
      assert.ok(brilho > 0 && rosto > 0);
      assert.notEqual(brilho, rosto);
      const pintura = criarPapel(mapa);
      aplicarAcao(pintura, mapa, {
        tipo: "preencher",
        cor: "#ff0000",
        regiao: rosto,
      });
      assert.deepEqual(
        [...pintura.slice((256 * 1200 + 382) * 4, (256 * 1200 + 382) * 4 + 3)],
        [255, 255, 255],
        "brilho do olho permanece branco ao pintar o rosto",
      );
    }
  }
});
