import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { constants, crc32, deflateSync, inflateSync } from "node:zlib";

function arquivos(pasta) {
  return readdirSync(pasta, { withFileTypes: true }).flatMap((item) =>
    item.isDirectory()
      ? arquivos(join(pasta, item.name))
      : item.name.endsWith(".png")
        ? [join(pasta, item.name)]
        : [],
  );
}

let total = 0,
  alterados = 0;
for (const arquivo of arquivos("public")) {
  if (
    /colorir\/bosque\/pagina-\d{2}(?:-regioes)?\.png$/.test(
      arquivo.replaceAll("\\", "/"),
    )
  )
    continue;
  const original = readFileSync(arquivo),
    partes = [];

  if (
    !original
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    throw new Error(`PNG inválido: ${arquivo}`);

  for (let pos = 8; pos < original.length; ) {
    const tamanho = original.readUInt32BE(pos),
      fim = pos + tamanho + 12;

    if (fim > original.length) throw new Error(`PNG truncado: ${arquivo}`);
    partes.push({
      tipo: original.toString("ascii", pos + 4, pos + 8),
      bytes: original.subarray(pos, fim),
    });
    pos = fim;
  }

  if (partes.some((parte) => parte.tipo === "acTL")) continue;
  const bruto = inflateSync(
    Buffer.concat(
      partes
        .filter((p) => p.tipo === "IDAT")
        .map((p) => p.bytes.subarray(8, -4)),
    ),
  );

  const compactado = [
    constants.Z_DEFAULT_STRATEGY,
    constants.Z_FILTERED,
    constants.Z_RLE,
  ]
    .map((strategy) => deflateSync(bruto, { level: 9, strategy }))
    .sort((a, b) => a.length - b.length)[0];

  if (!inflateSync(compactado).equals(bruto))
    throw new Error(`Fluxo divergente: ${arquivo}`);
  const idat = Buffer.alloc(compactado.length + 12);
  idat.writeUInt32BE(compactado.length);
  idat.write("IDAT", 4);
  compactado.copy(idat, 8);
  idat.writeUInt32BE(crc32(idat.subarray(4, -4)), idat.length - 4);
  let inserido = false;

  const otimizado = Buffer.concat([
    original.subarray(0, 8),
    ...partes.flatMap((parte) => {
      if (parte.tipo !== "IDAT") return [parte.bytes];
      if (inserido) return [];
      inserido = true;
      return [idat];
    }),
  ]);

  if (original.length - otimizado.length < 512) continue;
  total += original.length - otimizado.length;
  alterados++;
  if (process.argv.includes("--aplicar")) writeFileSync(arquivo, otimizado);
}

console.log(
  `${alterados} PNGs; ${(total / 1048576).toFixed(2)} MiB de economia ${process.argv.includes("--aplicar") ? "aplicada" : "possível"}. Pixels e metadados preservados.`,
);
