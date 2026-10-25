# Rolagens do bosque

Padrão autorizado: joaninha nos dois eixos, galho/cipó sem moldura ou fundo de input. O menu mantém a decoração horizontal de ponta a ponta e o inseto limitado ao percurso útil. O vertical fica à direita; cada controle ocupa 44px e aparece somente com overflow.

O cabeçalho permanece fixo durante a rolagem. O controle vertical da página começa abaixo da trilha do menu; apenas o desenho do galho se prolonga 20px para encontrar o centro do galho horizontal, preservando a área de arraste horizontal. As medidas vêm do cabeçalho real e são atualizadas no resize, inclusive ao trocar idioma. A altura também alimenta scroll-padding-top para que âncoras não fiquem escondidas pelo cabeçalho. Sem trilha horizontal, o vertical começa após o cabeçalho. Controles internos e de modais continuam limitados às respectivas áreas.

## Responsabilidades

- `components/TrilhoBosque/`: arte SVG, apresentação, orientação e range nativo; reutilizado pelo menu e pelas áreas globais.
- `app/components/MenuBosque/` e `app/hooks/useRolagemMenu.js`: menu, medição e sincronização locais existentes.
- `components/RolagensBosque/`: renderização dos controles globais, nomes acessíveis e portals.
- `hooks/useRolagensBosque.js`: observação do documento, áreas internas, geometria, sincronização e limpeza de recursos.
- `styles/global.js`: espaço reservado, substituição da barra nativa somente nas áreas efetivamente gerenciadas.

Sem dependências novas ou alteração dos contratos de progresso, livros ou jogos. O gerenciador é irmão do App dentro do ProviderInterface; rolar a página não renderiza novamente os jogos. Scroll/resize são agrupados por requestAnimationFrame. ResizeObserver, mudanças relevantes do DOM e carregamento de imagens atualizam as medidas; mutações dos próprios controles são ignoradas.

## Áreas atendidas

O documento é identificado automaticamente. Papers e conteúdos roláveis de Dialog do MUI são reconhecidos, incluindo confirmações pequenas em celulares. Áreas específicas usam `data-rolagem-bosque=""`, aplicado ao viewport que possui overflow auto/scroll, como o zoom do livro e a paleta de cores. Novas áreas de rolagem devem reutilizar esse atributo; o menu usa o mesmo TrilhoBosque com seu hook local.

O gerenciador usa atributos temporários `data-rolagem-bosque-x/y` apenas quando necessário e reserva 44px por eixo. Não esconder barras nativas globalmente fora dessas áreas: a rolagem original permanece disponível se o gerenciador não estiver montado. A paleta ajusta as colunas para preservar botões de 44px. Não são substituídos controles internos do navegador/sistema operacional, como caixas de seleção nativas ou o próprio navegador.

Nos modais, os controles são inseridos no Paper, preservando foco e empilhamento. Escape é encaminhado ao modal original; setas do range não avançam páginas ou cenas. Modais inativos e regiões inert/aria-hidden não recebem controles. A rolagem da página é ocultada quando o corpo é bloqueado por modal ou loading.

O range vertical é um controle horizontal rotacionado, evitando depender de variantes proprietárias de inputs verticais. Setas para baixo/cima movem a posição em 1%; PageDown/PageUp em 10%; Home/End vão aos extremos. Um brilho no inseto identifica foco por teclado. As perninhas da joaninha animam somente durante movimento, com prefers-reduced-motion respeitado.

## Verificação

`tests/rolagens-bosque.test.js` cobre página, dois eixos no leitor, remoção/resize, pausa, limpeza, loading e Escape. Os testes de menu, controles de pintura, identidade de histórias, idiomas e livros protegem os consumidores afetados. Lint e build completam a verificação estática. Isso não substitui a conferência visual e de toque em navegador real.
