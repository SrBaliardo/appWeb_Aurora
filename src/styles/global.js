import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face { font-family: 'Goldman'; src: url('/fonts/goldman/Goldman-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }
  @font-face { font-family: 'KyivType Sans'; src: url('/fonts/kyivtype/KyivTypeSans-Regular.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; scroll-padding-top: var(--altura-cabecalho-bosque, 0px); }
  body { margin: 0; color: #29463c; background: #fffbed; font-family: 'Trebuchet MS', 'Segoe UI', sans-serif; }
  [data-rolagem-bosque-x], [data-rolagem-bosque-y] { scrollbar-width: none; }
  [data-rolagem-bosque-x]::-webkit-scrollbar, [data-rolagem-bosque-y]::-webkit-scrollbar { display: none; }
  html[data-rolagem-bosque-y] body { padding-right: 44px; }
  html[data-rolagem-bosque-y] [data-cabecalho-bosque] { width: calc(100% + 44px); }
  html[data-rolagem-bosque-x] body { padding-bottom: 44px; }
  [data-rolagem-bosque-y]:not(html) { padding-right: 44px !important; }
  [data-rolagem-bosque-x]:not(html) { padding-bottom: 44px !important; }
  button, a { -webkit-tap-highlight-color: transparent; }
  button { font: inherit; }
  button:not(:disabled), a { cursor: pointer; }
  a { color: inherit; }
  button:focus-visible, a:focus-visible, [role='button']:focus-visible { outline: 3px solid #b06826; outline-offset: 5px; }
  [tabindex='-1']:not(button):not(a):not(input):not(select):not(textarea):not([role='button']):focus { outline: none; }
  button:disabled { cursor: default; }
  ::selection { background: #ffda61; color: #29463c; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  }
`;
