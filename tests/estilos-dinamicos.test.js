import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { transformSync } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

function carregar(caminho, extra = "") {
  const module = { exports: {} };
  const codigo = transformSync(readFileSync(caminho, "utf8"), {
    loader: "js",
    format: "cjs",
  }).code;
  runInNewContext(codigo + extra, {
    module,
    exports: module.exports,
    require: createRequire(import.meta.url),
  });
  return module.exports;
}

function cssDoComponente(Componente, props) {
  const sheet = new ServerStyleSheet();
  try {
    renderToStaticMarkup(
      sheet.collectStyles(React.createElement(Componente, props)),
    );
    return sheet.getStyleTags();
  } finally {
    sheet.seal();
  }
}

test("flor mantém os oito intervalos de queda e reposição das pétalas", () => {
  const { quedas } = carregar(
    "src/components/Carregamento/styles.js",
    "\nmodule.exports.quedas = quedas;",
  );
  assert.equal(quedas.length, 8);
  for (let i = 0; i < 8; i++) {
    assert.equal(
      quedas[i].rules.replace(/\s/g, ""),
      `0%,${10 + i * 7}%{opacity:1;transform:translate(0,0)rotate(0);}${17 + i * 7}%,82%{opacity:0;transform:translate(10px,30px)rotate(18deg);}90%,100%{opacity:1;transform:translate(0,0)rotate(0);}`,
    );
  }
});

test("bordas e animação de sucesso preservam os valores do CSS gerado", () => {
  const { Moldura } = carregar("src/components/QuadroFigura/styles.js");
  for (const tracejada of [true, false]) {
    const css = cssDoComponente(Moldura, {
      $tamanho: 150,
      $tracejada: tracejada,
      $borda: "#123456",
      $fundo: "#ffffff",
      $angulo: 3,
    });
    assert.ok(
      css.includes(`border:2px ${tracejada ? "dashed" : "solid"} #123456`),
    );
  }
  const { Celula } = carregar("src/pages/sequencias/jogar/styles.js");
  const final = cssDoComponente(Celula, { $final: true, $venceu: true });
  assert.ok(final.includes("border:2px dashed #80af56"));
  assert.match(final, /animation:[^;]+ 0\.6s ease;/);
  const comum = cssDoComponente(Celula, { $final: false, $venceu: false });
  assert.ok(comum.includes("border:2px solid #ead399"));
  assert.ok(comum.includes("animation:none 0.6s ease;"));
});
