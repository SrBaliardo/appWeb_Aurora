let bancoPendente;

function abrirBanco() {
  if (!globalThis.indexedDB)
    return Promise.reject(new Error("Armazenamento indisponível."));
  if (!bancoPendente) {
    bancoPendente = new Promise((resolve, reject) => {
      const pedido = indexedDB.open("aurora-colorir", 1);
      pedido.onupgradeneeded = () =>
        pedido.result.createObjectStore("pinturas", { keyPath: "id" });
      pedido.onerror = () => {
        bancoPendente = null;
        reject(pedido.error);
      };
      pedido.onblocked = () => {
        bancoPendente = null;
        reject(new Error("Armazenamento ocupado."));
      };
      pedido.onsuccess = () => {
        pedido.result.onversionchange = () => {
          pedido.result.close();
          bancoPendente = null;
        };
        resolve(pedido.result);
      };
    });
  }
  return bancoPendente;
}

async function transacao(modo, executar) {
  const banco = await abrirBanco();
  return new Promise((resolve, reject) => {
    const tx = banco.transaction("pinturas", modo),
      pedido = executar(tx.objectStore("pinturas"));
    tx.oncomplete = () => resolve(pedido.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () =>
      reject(tx.error || new Error("Salvamento interrompido."));
  });
}

export const carregarPintura = (id) =>
  transacao("readonly", (store) => store.get(id));

export const listarPinturas = () =>
  transacao("readonly", (store) => store.getAll());

export const salvarPintura = (registro) =>
  transacao("readwrite", (store) => store.put(registro));

async function carregarImagem(url, signal) {
  const resposta = await fetch(url, { signal });
  if (!resposta.ok) throw new Error("Imagem indisponível.");
  return createImageBitmap(await resposta.blob(), {
    colorSpaceConversion: "none",
    premultiplyAlpha: "none",
  });
}

export async function carregarDesenho(pagina, signal, { legado = false } = {}) {
  const fontes = [
    pagina.imagem,
    pagina.mascara,
    pagina.cobertura,
    ...(legado ? [pagina.mascaraLegada] : []),
  ];
  const resultados = await Promise.allSettled(
    fontes.map((url) => carregarImagem(url, signal)),
  );
  if (resultados.some((r) => r.status === "rejected")) {
    resultados.forEach((r) => {
      if (r.status === "fulfilled") r.value.close();
    });
    throw new Error("Não foi possível abrir o desenho.");
  }
  const [imagem, ...mascaras] = resultados.map((r) => r.value);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = imagem.width;
    canvas.height = imagem.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingEnabled = false;
    const dados = mascaras.map((mascara) => {
      if (imagem.width !== mascara.width || imagem.height !== mascara.height)
        throw new Error("Máscara incompatível.");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(mascara, 0, 0);
      return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    });
    return {
      imagem,
      largura: imagem.width,
      altura: imagem.height,
      pixels: dados[0],
      cobertura: dados[1],
      legado: dados[2],
    };
  } catch (erro) {
    imagem.close();
    throw erro;
  } finally {
    mascaras.forEach((mascara) => mascara.close());
  }
}

export function exibirPintura(canvas, imagem, pixels) {
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "source-over";
  ctx.putImageData(new ImageData(pixels, canvas.width, canvas.height), 0, 0);
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(imagem, 0, 0);
  ctx.globalCompositeOperation = "source-over";
}

export function capturarMiniatura(canvas) {
  const mini = document.createElement("canvas");
  mini.width = 240;
  mini.height = 160;
  mini.getContext("2d").drawImage(canvas, 0, 0, 240, 160);
  return new Promise((resolve, reject) =>
    mini.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Não foi possível capturar a pintura.")),
      "image/png",
    ),
  );
}

export async function baixarPintura(canvas, nome) {
  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) =>
        b
          ? resolve(b)
          : reject(new Error("Não foi possível baixar a pintura.")),
      "image/png",
    ),
  );
  const url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = nome;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
