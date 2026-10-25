import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { LIVROS } from "../src/contexts/livros/constantes.js";
import { construirCatalogo } from "../src/contexts/livros/builders/catalogo.js";
import { limitarPagina } from "../src/contexts/livros/regras.js";
import { createHash } from "node:crypto";

test("somente o Bosque disponibiliza páginas internas para leitura", () => {
  const livros = construirCatalogo(LIVROS);
  assert.equal(livros.length, 6);
  assert.deepEqual(
    livros.filter((livro) => livro.paginas.length).map((livro) => livro.id),
    ["bosque"],
  );
  assert.equal(livros[0].paginas.length, 38);
  assert.equal(livros[0].paginas[37], "/books/bosque/pagina-038.jpg");
  assert.deepEqual(readdirSync("public/books").sort(), [
    "bosque",
    "covers",
    "en-US",
    "es-ES",
  ]);
  assert.equal(
    readdirSync("public/books/bosque").filter((nome) => nome.endsWith(".jpg"))
      .length,
    38,
  );
  for (const livro of livros) {
    for (const imagem of [livro.capa, ...livro.paginas]) {
      assert.ok(existsSync(`public${imagem}`), imagem);
      const bytes = readFileSync(`public${imagem}`);
      assert.equal(bytes.readUInt16BE(0), 0xffd8, imagem);
      assert.equal(bytes.readUInt16BE(bytes.length - 2), 0xffd9, imagem);
    }
  }
});

test("somente o livro gratuito disponibiliza PDF íntegro para download", () => {
  const livros = construirCatalogo(LIVROS);
  assert.deepEqual(
    livros.filter((livro) => livro.download).map((livro) => livro.id),
    ["bosque"],
  );
  assert.equal(livros[0].tamanhoAproximadoMB, 58);
  const hash = (caminho) =>
    createHash("sha256").update(readFileSync(caminho)).digest("hex");
  assert.equal(
    hash(`public${livros[0].download}`),
    "845c3a6dabf3e4003b9e64f34131d3a39db13770f6e54158d6ac6ce68308b007",
  );
});

test("leitor mantém a navegação entre a primeira e a última página", () => {
  assert.equal(limitarPagina(0, 38), 1);
  assert.equal(limitarPagina(39, 38), 38);
  assert.equal(limitarPagina(12, 38), 12);
  assert.equal(limitarPagina(NaN, 38), 1);
});
