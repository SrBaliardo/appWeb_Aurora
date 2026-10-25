import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { construirPecas } from "../src/contexts/quebracabeca/builders/pecas.js";
import {
  avaliarEncaixe,
  concluiu,
} from "../src/contexts/quebracabeca/regras.js";
import { TEMAS } from "../src/contexts/quebracabeca/constantes.js";
import en from "../src/contexts/interface/mensagens/en-US.js";
import es from "../src/contexts/interface/mensagens/es-ES.js";

for (const [nivel, lado] of [
  ["facil", 3],
  ["dificil", 4],
]) {
  test(`${nivel}: peças únicas, embaralhadas, com encaixes complementares e bordas externas retas`, () => {
    const { pecas } = construirPecas(nivel, () => 0);
    assert.equal(pecas.length, lado * lado);
    assert.equal(new Set(pecas.map((peca) => peca.id)).size, pecas.length);
    assert.notDeepEqual(
      pecas.map((peca) => peca.posicao),
      Array.from({ length: lado * lado }, (_, i) => i),
    );
    for (const peca of pecas) {
      assert.match(peca.caminho, /^M0 0 .* Z$/);
      assert.ok(!peca.caminho.includes("NaN"));
      if (peca.linha === 0) assert.equal(peca.bordas[0], 0);
      if (peca.coluna === 0) assert.equal(peca.bordas[3], 0);
      if (peca.linha === lado - 1) assert.equal(peca.bordas[2], 0);
      if (peca.coluna === lado - 1) assert.equal(peca.bordas[1], 0);
      const direita = pecas.find(
        (item) => item.linha === peca.linha && item.coluna === peca.coluna + 1,
      );
      const abaixo = pecas.find(
        (item) => item.linha === peca.linha + 1 && item.coluna === peca.coluna,
      );
      if (direita) assert.equal(peca.bordas[1], -direita.bordas[3]);
      if (abaixo) assert.equal(peca.bordas[2], -abaixo.bordas[0]);
    }
  });
  test(`${nivel}: encaixe errado não conclui, duplicata não conta e somente todas as peças concluem`, () => {
    const { pecas } = construirPecas(nivel, () => 0.5);
    const primeira = pecas[0];
    assert.equal(
      avaliarEncaixe(pecas, [], primeira.id, primeira.posicao),
      "acerto",
    );
    assert.equal(
      avaliarEncaixe(
        pecas,
        [],
        primeira.id,
        (primeira.posicao + 1) % pecas.length,
      ),
      "erro",
    );
    assert.equal(
      avaliarEncaixe(pecas, [primeira.id], primeira.id, primeira.posicao),
      "ignorar",
    );
    assert.equal(
      avaliarEncaixe(pecas, [primeira.id], pecas[1].id, primeira.posicao),
      "ignorar",
    );
    assert.equal(avaliarEncaixe(pecas, [], "inexistente", 0), "ignorar");
    for (const invalido of [-1, null, NaN, 0.5, pecas.length])
      assert.equal(avaliarEncaixe(pecas, [], primeira.id, invalido), "ignorar");
    assert.equal(concluiu(pecas, Array(pecas.length).fill(primeira.id)), false);
    assert.equal(concluiu(pecas, pecas.map((peca) => peca.id).slice(1)), false);
    assert.equal(
      concluiu(
        pecas,
        pecas.map((peca) => peca.id),
      ),
      true,
    );
  });
}
test("quatro temas com três figuras, retratos existentes e nomes traduzidos", () => {
  assert.equal(TEMAS.length, 4);
  for (const tema of TEMAS) {
    assert.equal(tema.imagens.length, 3);
    assert.equal(new Set(tema.imagens.map((imagem) => imagem.id)).size, 3);
    for (const imagem of tema.imagens) {
      if (imagem.src) assert.ok(existsSync(`public${imagem.src}`));
      assert.ok(en[imagem.nome]);
      assert.ok(es[imagem.nome]);
    }
  }
  assert.equal(concluiu([], []), false);
});
