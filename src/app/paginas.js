import { lazy } from "react";

export const paginas = {
  livros: lazy(() => import("../pages/livros/explorar/index.jsx")),
  colorir: lazy(() => import("../pages/colorir/explorar/index.jsx")),
  forca: lazy(() => import("../pages/forca/jogar/index.jsx")),
  palavras: lazy(() => import("../pages/palavras/completar/index.jsx")),
  memoria: lazy(() => import("../pages/memoria/jogar/index.jsx")),
  quebracabeca: lazy(() => import("../pages/quebracabeca/jogar/index.jsx")),
  cores: lazy(() => import("../pages/cores/jogar/index.jsx")),
  descobertas: lazy(() => import("../pages/descobertas/jogar/index.jsx")),
  matematica: lazy(() => import("../pages/matematica/jogar/index.jsx")),
  escrita: lazy(() => import("../pages/escrita/jogar/index.jsx")),
  sequencias: lazy(() => import("../pages/sequencias/jogar/index.jsx")),
  contagem: lazy(() => import("../pages/contagem/jogar/index.jsx")),
  classificacao: lazy(() => import("../pages/classificacao/jogar/index.jsx")),
  iniciais: lazy(() => import("../pages/iniciais/jogar/index.jsx")),
  historias: lazy(() => import("../pages/historias/jogar/index.jsx")),
};
