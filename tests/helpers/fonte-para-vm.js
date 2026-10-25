import { readFileSync } from "node:fs";
import { parse } from "espree";

// Retira apenas declarações de módulo, independentemente de quebras de linha.
// Preserva o corpo executado no VM e textos que contenham "import"/"export".
export function prepararFonte(texto) {
  const ast = parse(texto, {
    ecmaVersion: "latest",
    sourceType: "module",
    range: true,
  });
  const cortes = ast.body.flatMap((no) => {
    if (no.type === "ImportDeclaration") return [no.range];
    if (no.type === "ExportNamedDeclaration") {
      return [
        no.declaration ? [no.range[0], no.declaration.range[0]] : no.range,
      ];
    }
    return [];
  });
  for (const [inicio, fim] of cortes.sort((a, b) => b[0] - a[0])) {
    texto = texto.slice(0, inicio) + texto.slice(fim);
  }
  return texto;
}

export function lerFonteParaVM(caminho) {
  return prepararFonte(readFileSync(caminho, "utf8"));
}
