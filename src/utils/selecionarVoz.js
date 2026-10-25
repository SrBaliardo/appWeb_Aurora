function idiomaNormalizado(idioma) {
  return idioma.toLowerCase().replaceAll("_", "-");
}

const nomesFemininos =
  /\b(female|feminina|francisca|maria|thalita|vitoria|luciana|samantha|zira|aria|jenny|joanna|ava|michelle|emma|helena|elvira|abril|lucia|monica|conchita|paloma)\b/i;

function pontuar(voz) {
  const nome = voz.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return (
    (nomesFemininos.test(nome) ? 10 : 0) +
    (/natural|neural|enhanced|premium/i.test(nome) ? 2 : 0) +
    (voz.default ? 1 : 0)
  );
}

export function selecionarVoz(vozes, idioma) {
  const destino = idiomaNormalizado(idioma);
  const exatas = vozes.filter((voz) => idiomaNormalizado(voz.lang) === destino);
  const candidatas = exatas.length
    ? exatas
    : vozes.filter(
        (voz) =>
          idiomaNormalizado(voz.lang).split("-")[0] === destino.split("-")[0],
      );
  return candidatas.reduce(
    (melhor, voz) => (!melhor || pontuar(voz) > pontuar(melhor) ? voz : melhor),
    null,
  );
}
