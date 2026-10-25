# Pintura: regiões e acabamento v2

Pedido autorizado: corrigir vazamentos e pontos claros sem alterar os originais, revisar as 32 páginas e preservar progressos existentes. Não há novas dependências ou alteração do IndexedDB estrutural.

## Máscaras e cobertura

As 32 imagens de 1200×800 continuam byte a byte iguais. O mapa v1 `pagina-XX-regioes.png` também permanece intacto e disponível para reproduzir ações antigas.

Cada página ganha dois PNGs, aproximadamente 2,91 MiB adicionais para a coleção completa:

- `pagina-XX-v2-regioes.png`: identificador da região no ponto inicial; zero identifica barreiras e não aceita um novo clique de pintura.
- `pagina-XX-v2-cobertura.png`: região responsável por cada pixel, inclusive debaixo do traço. Não possui pixels sem dono. Preenchimento e pincel usam essa cobertura; o pincel permanece limitado ao identificador escolhido no primeiro toque.

A arte original é desenhada por cima com multiply. Assim, cor alcança as bordas sem remover o traço nem deixar pixels claros bloqueados pela preparação da máscara. A expansão é feita na preparação do mapa, e não é uma tolerância que cresce durante o gesto. O carregamento dos PNGs de dados desabilita conversão de cor, premultiplicação e suavização.

## Preparação e revisão

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refinar-colorir.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refinar-colorir.ps1 -Publicar
```

O primeiro comando gera conferências em `.tmp/colorir-v2/`; o segundo prepara e publica os 64 mapas. Publicação exige as 32 páginas. `scripts/colorir/RefinarColorir.cs` contém o processamento; `fechamentos.json` registra fechamentos pontuais em coordenadas de 1200×800. Não modifica arquivos em `materiais-originais/livrosColorir/`, PDFs, capas, miniaturas ou os mapas v1.

Etapas: limiar escuro 180; fechamento morfológico 7×7; preservação de pequenas áreas originalmente fechadas (até 120 pixels), importantes para brilhos e detalhes; aplicação dos fechamentos revisados; componentes conexos em quatro direções; agrupamento de resíduos de até oito pixels somente quando próximos de uma região clara maior. Expansão multiorigem determinística atribui os pixels de barreira à região próxima para o acabamento.

As 32 páginas foram inspecionadas em quatro pranchas. Fechamentos adicionais, verificados por rastreamento de caminhos entre áreas indevidamente conectadas:

| Página | Fechamentos | Exemplo |
| --- | ---: | --- |
| 8 | 2 | Passagens entre chão, fundo e entorno do tronco |
| 17 | 2 | Toalha do piquenique comunicando com o fundo pelas extremidades |
| 20 | 5 | Cabelo comunicando com fundo e passagens no horizonte |
| 24 | 4 | Interrupções entre personagens, horizonte e vegetação |
| 28 | 1 | Horizonte junto ao Coala |

Relatório por página: `scripts/colorir/relatorio-v2.json`. Total: 14 fechamentos pontuais, 642 resíduos agrupados e 340.539 pixels originalmente claros que estavam em barreiras e agora possuem cobertura. Esses números não significam regiões únicas ou quantidade de falhas visuais independentes.

Os identificadores v2 devem permanecer estáveis depois desta publicação. Revisão futura de geometria precisa de nova versão e compatibilidade correspondente. A conferência cobre as falhas identificadas e o acabamento de todos os pixels; não é prova de que cada detalhe desenhado tenha uma interpretação semântica única.

## Compatibilidade dos progressos

Banco IndexedDB `aurora-colorir`, versão estrutural 1 e chave do desenho permanecem iguais. O **registro da pintura** passa a `versao: 2`; aceita leitura de registros 1 e 2. Cada ação nova informa `versaoMascara: 2`.

Ao abrir registro v1, o catálogo fornece também o PNG v1. O builder marca as ações antigas com `versaoMascara: 1`. A reprodução usa exatamente o mapa original para elas, preservando cores, pontos de pincel, ordem e pixels sem reinterpretar identificadores. Ações seguintes usam v2; salvar mantém as duas gerações no mesmo histórico. Desfazer continua respeitando sua ordem. Nenhuma gravação destrutiva ocorre apenas por abrir a pintura.

Títulos e miniaturas são preservados. A máscara legada só é carregada quando há ações v1. Erros de arquivo continuam impedindo a abertura, em vez de produzir uma conversão parcial. Ações v2 com identificadores inválidos são rejeitadas.

Uma cor já espalhada indevidamente numa pintura antiga permanece como a criança a deixou: não é possível deduzir sua intenção com segurança. Ela pode refazer o preenchimento da região desejada para aplicar os limites novos, ou recomeçar após a confirmação existente. Isso também se aplica aos antigos pontos sem pintura, que permanecem na reprodução v1 até o retoque.

## Mapa e validação

- URLs e contratos de máscaras/ações → builders de `contexts/colorir`.
- Restrição do gesto, cobertura e reprodução por versão → regras puras do domínio.
- Carregamento coordenado e progresso → fachada pública; arquivo/bitmap/Canvas/IndexedDB → service existente.
- Tags de versão no gesto/snapshot → hook local de pintura, consumindo o mapa preparado pela fachada.

Verificações da etapa:

- `node --test tests/colorir.test.js tests/colorir-interacao.test.js tests/colorir-controles.test.js`: 22 testes, incluindo os 32 pares de mapas reais, fechamento dos caminhos revisados, ausência de pixels órfãos, brilho do olho separado do rosto, restauração exata de v1 e histórico misto reaberto em v2.
- Hashes SHA-256 das 32 artes e 32 mapas v1 preservados, registrados no relatório e conferidos nos testes.
- ESLint localizado dos arquivos de código e testes alterados, sem avisos.
- `npm.cmd run build`: aprovado, carregamento do editor continua separado do bundle principal.

Não há navegador conectado nesta sessão. Interação real de Canvas, IndexedDB, mouse e toque continua pendente; testes de regras, simulação da fachada/hook, inspeção dos PNGs e build não equivalem a essa verificação.
