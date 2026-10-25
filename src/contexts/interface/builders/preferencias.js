export function construirPreferenciasDeIdioma(navegador = {}) {
  const idiomas = Array.isArray(navegador?.languages)
    ? navegador.languages
    : [];
  const preferencias = [...idiomas, navegador?.language];

  return preferencias.flatMap((idioma) => {
    if (typeof idioma !== "string" || !idioma.trim()) return [];
    try {
      return Intl.getCanonicalLocales(idioma.trim().replaceAll("_", "-"));
    } catch {
      return [];
    }
  });
}
