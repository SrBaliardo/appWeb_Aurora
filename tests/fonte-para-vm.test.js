import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { prepararFonte } from "./helpers/fonte-para-vm.js";

test("VM aceita imports/exportações formatados em uma ou várias linhas", () => {
  const fonte = `import {
    primeira,
    segunda,
  } from "modulo";
  import * as terceiro from "outro";
  export const texto = "import e export dentro do texto permanecem";
  export function executar() { return primeira + segunda + terceiro.valor; }
  export { executar as publico };`;
  const codigo = prepararFonte(fonte);
  assert.equal(
    runInNewContext(`${codigo}\nexecutar()`, {
      primeira: 1,
      segunda: 2,
      terceiro: { valor: 3 },
    }),
    6,
  );
  assert.equal(
    runInNewContext(`${codigo}\ntexto`, { primeira: 1, segunda: 2 }),
    "import e export dentro do texto permanecem",
  );
});
