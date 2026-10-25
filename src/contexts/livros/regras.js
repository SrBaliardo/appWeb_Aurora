export function limitarPagina(pagina, total) {
  return Math.max(
    1,
    Math.min(total, Number.isFinite(pagina) ? Math.trunc(pagina) : 1),
  );
}
