const caminhos = {
  balde: (
    <>
      <path d="m5 4 10 10M10 3l9 9-8 8a3 3 0 0 1-4 0l-4-4a3 3 0 0 1 0-4Z" />
      <path d="M4 13h14m2 2s-3 4-3 5a3 3 0 0 0 6 0c0-1-3-5-3-5Z" />
    </>
  ),

  pincel: (
    <>
      <path d="m9 15 9-12a2 2 0 0 1 3 3L11 17Z" />
      <path d="M10 16c-2-3-6-1-6 2 0 2-2 3-2 3s9 2 9-4" />
    </>
  ),

  desfazer: <path d="M8 5 3 10l5 5M3 10h11a6 6 0 0 1 0 12" />,

  baixar: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
    </>
  ),

  ampliar: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="m15 15 6 6M6 10h8m-4-4v8" />
    </>
  ),

  reduzir: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="m15 15 6 6M6 10h8" />
    </>
  ),

  lapis: (
    <>
      <path d="m4 16-1 5 5-1L21 7l-4-4ZM14 6l4 4M4 16l4 4" />
    </>
  ),

  fechar: <path d="m6 6 12 12M18 6 6 18" />,

  check: <path d="m4 12 5 5L20 6" />,

  cadeado: (
    <>
      <rect x="4" y="10" width="16" height="12" rx="3" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3M12 15v3" />
    </>
  ),

  claquete: (
    <>
      <path d="M3 9h18v12H3ZM3 9 2 4l18-3 1 5ZM7 3l4 4m3-5 4 4" />
      <path d="m10 12 5 3-5 3Z" />
    </>
  ),

  quebracabeca: (
    <path d="M4 4h5V3a3 3 0 0 1 6 0v1h5v5h1a3 3 0 0 1 0 6h-1v5h-5v-1a3 3 0 0 0-6 0v1H4v-5h1a3 3 0 0 0 0-6H4Z" />
  ),

  livro: (
    <>
      <path d="M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z" />
    </>
  ),

  folha: (
    <>
      <path d="M19 4C9 3 3 8 6 15s14 4 13-11Z" />
      <path d="m5 21 10-12M10 13l1 5" />
    </>
  ),

  casa: (
    <>
      <path d="m3 11 9-8 9 8M6 10v11h12V10M10 21v-7h4v7" />
    </>
  ),

  seta: (
    <>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </>
  ),

  voltar: (
    <>
      <path d="M19 12H5m6-6-6 6 6 6" />
    </>
  ),

  audio: (
    <>
      <path d="M4 9h4l5-4v14l-5-4H4ZM17 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12" />
    </>
  ),

  lampada: (
    <>
      <path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2ZM12 1v2M2 9h2m16 0h2M4 3l2 2m12 0 2-2" />
    </>
  ),

  reiniciar: (
    <>
      <path d="M3 12a9 9 0 1 1 2.6 6.4M3 5v7h7" />
    </>
  ),

  estrela: (
    <>
      <path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" />
    </>
  ),

  coracao: (
    <>
      <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 2 10 8 15 6-5 13-10 8-15Z" />
    </>
  ),

  memoria: (
    <>
      <rect x="3" y="3" width="7" height="8" rx="2" />
      <rect x="14" y="3" width="7" height="8" rx="2" />
      <rect x="3" y="15" width="7" height="7" rx="2" />
      <rect x="14" y="15" width="7" height="7" rx="2" />
    </>
  ),

  letras: (
    <>
      <path d="m3 19 5-14 5 14M5 14h6M16 5h3a3 3 0 0 1 0 6h-3m0-6v14h4a4 4 0 0 0 0-8h-4" />
    </>
  ),

  cores: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4c-1-1 0-3 2-3h2a3 3 0 0 0 3-3 9 9 0 0 0-9-8Z" />
      <circle cx="7" cy="10" r="1" />
      <circle cx="11" cy="7" r="1" />
      <circle cx="16" cy="8" r="1" />
    </>
  ),
};

export default function Icone({ nome, tamanho = 22 }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {caminhos[nome] || caminhos.estrela}
    </svg>
  );
}
