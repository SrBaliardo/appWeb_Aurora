# Aurora Goodies na plataforma

## Escopo autorizado

A solicitação para retomar a pintura e a aprovação da proposta substituem o adiamento inicial para esta funcionalidade. Nova fronteira: **colorir**, separada do jogo educativo **cores** e da leitura em **livros**. O AGENTS.md permanece intacto. Sem dependências novas, login, backend, anúncios ou serviço remoto.

Fluxo em `#/colorir`: coleção → galeria do Bosque → pintura. As três telas usam o conteúdo principal. Ao abrir um desenho, o editor ocupa o espaço restante do viewport abaixo do cabeçalho, mantendo marca, idiomas e menu visíveis e acessíveis. O rodapé fica oculto somente durante a pintura. Não há modal sobre a aplicação: somente as confirmações usam Dialog do MUI. Ao voltar, restaura a galeria e o layout normal. A navegação pelo cabeçalho aguarda o salvamento; em caso de falha, mantém o desenho aberto e oferece nova tentativa, download, cancelamento ou confirmação de saída. Em telas baixas/estreitas, a paleta pode rolar internamente, preservando o espaço da imagem e controles de 44px. O terceiro banner da página inicial leva à coleção. Carrossel mantém cinco segundos, pausa por hover/foco e navegação manual.

## Mapa de responsabilidades

| Responsabilidade | Destino |
| --- | --- |
| Catálogo, paleta e versão do progresso | `contexts/colorir/constantes.js` |
| URLs do catálogo, decodificação do mapa e contrato salvo | `contexts/colorir/builders/` |
| Identificação de região, pincel restrito, preenchimento e reconstrução | `contexts/colorir/regras.js` |
| Operações públicas, coordenação e fila de gravação por desenho | `contexts/colorir/index.js` |
| Arquivos/imagens, Canvas e IndexedDB | `services/colorir/index.js` |
| Composição, navegação interna, interação e estados visuais | `pages/colorir/explorar/` |
| Rota e integração ao menu | `app/` |
| Terceiro destaque | `pages/inicio/explorar/` |

Pages não importam internos de context nem o service. Não há dependência entre os domínios colorir/livros/cores, Providers novos ou intermediários sem função. MUI mantém Dialog e foco da confirmação; estilos próprios em styled-components. Página carregada sob demanda.

## Arquivos publicados

Capas, títulos e downloads acompanham os três idiomas da interface. As edições em inglês e espanhol ficam em `public/colorir/en-US/` e `public/colorir/es-ES/`. Os 32 desenhos, miniaturas, máscaras e identificadores são compartilhados entre idiomas, preservando pinturas salvas. Veja [a preparação das edições](livros-idiomas.md). Os tamanhos abaixo descrevem os arquivos originais em português, antes dessa ampliação.

Fontes intactas em `materiais-originais/livrosColorir/`. Os arquivos finais são os de `imagens/`; capas com títulos vêm das renderizações prontas `producao/qa/pagina-01.png`.

Em `public/colorir/`: seis capas reduzidas, 32 imagens do Bosque em 1200×800, 32 miniaturas 240×160, 32 mapas PNG v1 preservados, 64 mapas v2 de região/cobertura e somente o PDF gratuito do Bosque. Após compactação sem perdas, total aproximado: 73,34 MiB; o PDF responde por 41,7 MiB e só é solicitado ao baixar. As imagens são carregadas por página, miniaturas com lazy loading. Nenhum interior/PDF dos outros cinco volumes é publicado.

PDF gratuito copiado integralmente, SHA-256:
`A9F6FC24DC0E6EF8163DD1350E330BC14ED2508375F9D4D95C050FB043149EAA`.

Preparação reproduzível no Windows, sem instalar bibliotecas:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/preparar-colorir.ps1 -Piloto
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/preparar-colorir.ps1
```

System.Drawing/C# prepara derivados e máscaras, sem redesenhar ou alterar os originais. O piloto utiliza páginas 1, 16 e 32. A execução completa publica os derivados e mantém conferências coloridas em `.tmp/colorir-piloto/`. Capas preservam a proporção A4 paisagem; dentro dos cards são exibidas com object-fit contain.

## Regiões e pintura

Máscaras v2: delimitação separada da cobertura de pintura, fechamento morfológico 7×7, detalhes pequenos preservados e fechamentos pontuais revisados. Os mapas v1 com fechamento 3×3 continuam disponíveis para reproduzir os progressos antigos. Veja docs/colorir-mascaras-v2.md para processamento, revisão e compatibilidade. PNG RGB codifica o identificador; zero representa barreira. Os contornos da imagem original são compostos por cima com multiply. A máscara é estável e não depende da tinta já aplicada.

Preencher colore a região do clique. Pincel tem raio 18 na imagem interna e captura um único pointer; o traço permanece na região inicial até soltar, cancelar ou perder a captura. Outro dedo não troca a região nem conclui o traço ativo. Segmentos são interpolados para evitar buracos em movimentos rápidos. Pintura atualizada em requestAnimationFrame; sem classe CSS por movimento. O cursor de mouse é um círculo com bordas clara e escura para as duas ferramentas. A moldura é ajustada por ResizeObserver ao espaço disponível, preservando 3:2, sem rolagem no editor. Ampliar aproveita mais desse espaço; Reduzir volta à apresentação normal. Não amplia por recorte/rolagem.

As regiões são áreas **fechadas pelo traço**, não classificações semânticas de personagem/objeto. Cabelo, rosto ou fundo conectados por aberturas maiores podem compartilhar uma região. As três amostras foram inspecionadas individualmente e as 32 páginas em pranchas; isso não equivale a conferir manualmente cada região. Refinamento pontual de máscaras pode ser necessário após uso real. Alterar mapas publicados exige tratar a compatibilidade dos progressos, cujos identificadores se referem à máscara atual.

Desfazer remove a última ação e reconstrói a pintura. Recomeçar requer confirmação e substitui o progresso desse desenho após salvar. O PNG baixado inclui traço e cores e usa `aurora_goodies-{titulo}.png`, preservando espaços e acentos. Caracteres incompatíveis com nomes de arquivo são substituídos. Balde e pincel são botões de ícone lado a lado. Desfazer permanece junto à paleta; Baixar, Ampliar/Reduzir e Recomeçar ficam abaixo da moldura.

## Progresso sem conta

IndexedDB: banco `aurora-colorir`, versão 1, object store `pinturas`, chave `id` (`bosque-1` até `bosque-32`). Registro de pintura versão 2 (compatível com versão 1): id, ações com versão de máscara, miniatura Blob, titulo opcional e atualizadoEm. O campo titulo é adicional: registros anteriores continuam válidos, sem migração destrutiva. Novas edições têm limite de 40 caracteres; títulos antigos de até 60 permanecem intactos até serem editados e confirmados. O campo sem borda, outline, fundo ou espaçamento interno mantém a posição e a linha de 44px do título exibido e cresce conforme o texto entre 215 e 450px (encolhe em telas estreitas); inserções que ultrapassam a largura medida são bloqueadas. Lápis, X vermelho e check verde usam ícones de 32px, traço mais grosso, sem borda ou preenchimento, preservando área de toque de 44px. O check confirma e o X cancela; o lápis devolve foco após editar. A galeria exibe o nome confirmado. Nenhum dado é enviado ao servidor.

Salva após um segundo sem novas ações, ao confirmar um título alterado, ao voltar à galeria e por tentativa de saída/ocultação. Captura corresponde à mesma revisão das ações. Fila por desenho impede uma captura antiga de sobrescrever uma recente, inclusive ao reabrir. A abertura aguarda gravações pendentes desse desenho; voltar à galeria aguarda o salvamento. Mudança de idioma da interface preserva o editor montado.

Salvar só exibe sucesso depois de completar a transação. Falhas de quota/permissão mostram mensagem, mantêm a pintura em memória e permitem nova tentativa ao alterar/voltar ou baixar. Falha de leitura mantém o editor utilizável com aviso. O contrato de ações é validado antes de reproduzir. A galeria mostra a miniatura salva e “Continuar colorindo”.

Progresso restrito ao mesmo navegador, perfil, origem e aparelho. Limpeza dos dados, modo privado e políticas do navegador podem removê-lo. Não há sincronização, recuperação remota ou garantia da última ação ao fechar abruptamente o processo antes de concluir a gravação. Baixar o PNG é a cópia independente.

## Acessibilidade e idiomas

PT-BR/EN/ES para a interface; marca e títulos editoriais preservados. Controles com pelo menos 44px, foco visível, estados de erro/salvamento acessíveis, paleta com nome e marca de seleção. A interface e a edição de título mantêm controles por teclado. O modo de colorir regiões por teclado foi removido por pedido explícito; pintar depende de mouse/caneta/toque. O modo de pintura não possui rolagem. A paleta adapta a distribuição em telas estreitas/baixas, com controles de pelo menos 44px. Animações de miniaturas seguem a regra global de movimento reduzido. Loading floral existente reutilizado.

## Validação

- Lint localizado dos arquivos alterados, regras, services, páginas e testes: aprovado.
- `node --test tests/colorir-controles.test.js tests/colorir.test.js tests/colorir-interacao.test.js tests/livros.test.js tests/interface.test.js`: 27 testes aprovados. Inclui título/cancelamento/foco/nome de PNG, moldura após montagem no portal, agrupamento de controles, seis cards e ações dos livros. Regras, contrato salvo, máscaras reais do piloto, integridade do PDF, tradução da paleta, ordenação assíncrona, interação simulada do hook, erro de gravação, descarte de imagem após sair e rotação/pausa dos três banners.
- `node .tmp/colorir-render.cjs`: 21 renderizações estáticas (coleção Goodies, coleção Livros, galeria, editor e três banners × três idiomas; Dialog real com portal desativado somente no teste); botões não aninhados e CSS sem valores inválidos.
- `npm.cmd run build`: aprovado; código do editor em chunk separado.
- Sem repositório Git disponível para diff check. Não há navegador conectado: IndexedDB real, gesto de toque, Canvas no navegador, download e aparência responsiva ainda precisam de conferência interativa. Simulações e build não comprovam essa jornada.

## Cards e banners

As duas coleções apresentam seis cards, incluindo o Bosque gratuito. Cinco cards usam o componente compartilhado BotaoBloqueado: cadeado sem ação de abrir/download, com nome acessível. O gratuito inicia pintura ou leitura. Os banners possuem duas ações lado a lado e metadados alinhados à direita. Nenhum interior adicional foi liberado.

Revisão de vazamentos e acabamento: [máscaras v2 e preservação dos progressos](colorir-mascaras-v2.md).
