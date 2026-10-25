export const IDIOMAS_INTERFACE = ["pt-BR", "en-US", "es-ES"];

export function idiomaInterfaceValido(idioma) {
  return IDIOMAS_INTERFACE.includes(idioma);
}

export function selecionarIdiomaPreferido(preferencias) {
  const suportados = { pt: "pt-BR", en: "en-US", es: "es-ES" };
  for (const idioma of preferencias) {
    const correspondente = suportados[idioma.split("-")[0].toLowerCase()];
    if (correspondente) return correspondente;
  }
  return "en-US";
}
