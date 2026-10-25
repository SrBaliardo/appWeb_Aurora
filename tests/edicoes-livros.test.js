import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { runInNewContext } from "node:vm";
import { transformSync } from "esbuild";
import * as jsx from "react/jsx-runtime";
import { useLivros } from "../src/contexts/livros/index.js";
import { useColorir } from "../src/contexts/colorir/index.js";
import { EDICOES as livrosTraduzidos } from "../src/contexts/livros/edicoes.js";
import { EDICOES as goodiesTraduzidos } from "../src/contexts/colorir/edicoes.js";
import { construirTradutor } from "../src/contexts/interface/builders/mensagem.js";
import en from "../src/contexts/interface/mensagens/en-US.js";
import es from "../src/contexts/interface/mensagens/es-ES.js";

for (const idioma of ["en-US", "es-ES"]) {
  test(`${idioma}: seis capas traduzidas, leitura completa e somente os PDFs gratuitos do Bosque`, () => {
    const { livros, livroGratuito } = useLivros(idioma);
    const colorir = useColorir(idioma);
    assert.equal(livros.length, 6);
    assert.equal(colorir.livros.length, 6);
    assert.equal(
      livroGratuito.titulo,
      idioma === "en-US" ? "The Woods Are Calling" : "El bosque nos llama",
    );
    for (const [tipo, catalogo, edicoes] of [
      ["books", livros, livrosTraduzidos],
      ["colorir", colorir.livros, goodiesTraduzidos],
    ]) {
      assert.deepEqual(
        catalogo.filter((livro) => livro.download).map((livro) => livro.id),
        ["bosque"],
      );
      for (const livro of catalogo) {
        assert.ok(livro.capa.startsWith(`/${tipo}/${idioma}/`));
        assert.ok(existsSync(`public${livro.capa}`));
        assert.equal(livro.titulo, edicoes[idioma][livro.id].titulo);
        assert.equal(livro.idioma, edicoes[idioma][livro.id].idioma);
        if (!livro.gratuito) {
          assert.equal(livro.download, null);
          assert.equal(livro.paginas.length, 0);
        }
      }
      const gratuito = catalogo[0];
      const pdf = readFileSync(`public${gratuito.download}`);
      assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
      assert.equal(pdf.length, edicoes[idioma].bosque.bytes);
      assert.equal(
        createHash("sha256").update(pdf).digest("hex"),
        edicoes[idioma].bosque.sha256,
      );
      assert.ok(pdf.length < 100 * 1048576);
    }
    assert.equal(livroGratuito.paginas.length, 38);
    for (const pagina of livroGratuito.paginas)
      assert.ok(existsSync(`public${pagina}`));
    assert.deepEqual(readdirSync(`public/books/${idioma}`).sort(), [
      "bosque",
      "covers",
    ]);
    assert.deepEqual(readdirSync(`public/colorir/${idioma}`).sort(), [
      "bosque",
      "capas",
    ]);
    assert.equal(readdirSync(`public/books/${idioma}/covers`).length, 6);
    assert.equal(readdirSync(`public/colorir/${idioma}/capas`).length, 6);
    const portugues = useColorir().livroGratuito.paginas;
    assert.deepEqual(
      colorir.livroGratuito.paginas,
      portugues,
      "desenhos, IDs e máscaras continuam compartilhados entre os idiomas",
    );
  });
}

function elementos(no) {
  return !no || typeof no !== "object"
    ? []
    : [no, ...[no.props?.children].flat(Infinity).flatMap(elementos)];
}
function pagina(tipo, idioma, destaque = 0) {
  const arquivo = `src/pages/${tipo}/explorar/index.jsx`,
    texto = readFileSync(arquivo, "utf8"),
    module = { exports: {} };
  const estilos = Object.fromEntries(
    [...texto.matchAll(/\bS\.(\w+)/g)].map((m) => [m[1], m[1]]),
  );
  const t = construirTradutor(
    idioma === "en-US" ? en : idioma === "es-ES" ? es : {},
  );
  runInNewContext(
    transformSync(texto, { loader: "jsx", format: "cjs", jsx: "automatic" })
      .code,
    {
      module,
      exports: module.exports,
      require: (id) => {
        if (id === "react/jsx-runtime") return jsx;
        if (id === "./styles") return estilos;
        if (id.includes("contexts/interface"))
          return { useInterface: () => ({ t, idiomaInterface: idioma }) };
        if (id.includes("contexts/livros")) return { useLivros };
        if (id.includes("contexts/colorir")) return { useColorir };
        if (id.includes("useLeitura"))
          return { useLeitura: () => ({ aberto: false, abrir() {} }) };
        if (id.includes("useExplorarColorir"))
          return {
            useExplorarColorir: () => ({ tela: "colecao", abrirLivro() {} }),
          };
        if (id.includes("useCarrossel"))
          return { useCarrossel: () => ({ destaque }) };
        return { __esModule: true, default: "componente" };
      },
    },
  );
  return elementos(module.exports.default());
}

for (const idioma of ["pt-BR", "en-US", "es-ES"]) {
  test(`${idioma}: banners, cards, títulos e downloads acompanham o idioma da interface`, () => {
    const livros = useLivros(idioma),
      colorir = useColorir(idioma);
    for (const [tipo, catalogo] of [
      ["livros", livros],
      ["colorir", colorir],
    ]) {
      const arvore = pagina(tipo, idioma),
        cards = arvore.filter((e) => e.type === "Livro");
      assert.equal(cards.length, 6);
      assert.equal(
        arvore.find((e) => e.type === "Download").props.href,
        catalogo.livroGratuito.download,
      );
      for (const [i, card] of cards.entries()) {
        const itens = elementos(card);
        assert.equal(
          itens.find((e) => e.type === "img").props.src,
          catalogo.livros[i].capa,
        );
        const titulo = itens.find((e) => e.type === "h3");
        assert.equal(titulo.props.children, catalogo.livros[i].titulo);
        assert.equal(titulo.props.lang, catalogo.livros[i].idioma);
      }
    }
    const bannerLivros = pagina("inicio", idioma, 1).filter(
      (e) => e.type === "img",
    );
    assert.deepEqual(
      [...bannerLivros].map((e) => e.props.src),
      [livros.livros[1].capa, livros.livroGratuito.capa, livros.livros[2].capa],
    );
    assert.equal(
      pagina("inicio", idioma, 2).find((e) => e.type === "img").props.src,
      colorir.livroGratuito.capa,
    );
  });
}

test("idioma desconhecido preserva o catálogo português e seus caminhos públicos", () => {
  assert.equal(
    useLivros("desconhecido").livroGratuito.download,
    useLivros().livroGratuito.download,
  );
  assert.equal(
    useColorir("desconhecido").livroGratuito.download,
    useColorir().livroGratuito.download,
  );
});
