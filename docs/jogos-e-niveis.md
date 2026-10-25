# Ampliação: jogos e níveis

Escopo autorizado nesta etapa: tema de personagens como padrão da memória, vocabulário dos livros, três novos jogos e dificuldade em cada jogo. A escolha fica dentro da moldura de cada jogo, nunca na página inicial. Cada jogo retém o próprio nível enquanto a aplicação permanece aberta; a troca inicia uma nova rodada e limpa os timers da rodada anterior. Recarregar a aplicação volta ao fácil.

## Domínios e fronteiras

O catálogo inicial do AGENTS corresponde à primeira etapa. Esta ampliação solicitada pelo usuário acrescenta os seguintes domínios, mantendo as regras de camadas e APIs públicas:

| Responsabilidade | Fachada pública |
|---|---|
| Identificar objetos, formas e números; sortear conteúdo visual | contexts/descobertas/index.js |
| Gerar contas e avaliar resultados | contexts/matematica/index.js |
| Escrever nomes por posições consecutivas | contexts/escrita/index.js |

Escrita consome a API visual pública de descobertas e a normalização/alfabeto públicos de palavras. Não acessa internos de outro domínio. O banco de palavras é compartilhado publicamente com a forca. Hooks genéricos compartilham apenas interação de teclado, dicas e alternativas, recebendo a fachada que decide o acerto. MUI, styled-components, dependências e estrutura de pastas permanecem os mesmos.

## Dificuldades

| Jogo | Fácil | Difícil |
|---|---|---|
| Forca e palavrinhas | Palavras de até 8 letras, três dicas | Palavras a partir de 7 letras, uma dica; mais letras ocultas nas palavrinhas |
| Memória | 4×4, prévia de 3,2 segundos e nomes visíveis | Mesmo 4×4, prévia de 1,6 segundo, sem legendas visíveis |
| Cores | Dez cores básicas | Oito tonalidades: turquesa, lilás, bege, cinza, bordô, ocre, verde-oliva e azul-marinho |
| Descobertas | Figuras comuns, quatro formas básicas, números de 0 a 9 | Objetos mais complexos, polígonos e dezenas; uma dica |
| Contas | Soma/subtração, operandos e resultados de 0 a 9 | Soma/subtração com dezenas, multiplicação e divisão exata; resultados entre 10 e 198 |
| Escrita | Figuras comuns e números de 0 a 9 | Nomes mais complexos e números de 10 a 20/dezenas/cem; uma dica |

Todos os jogos permitem novas rodadas sem limite. Erro não revela automaticamente a resposta nem desconta vidas globais. A forca preserva seis erros por rodada. Não há resultados negativos, frações ou divisão por zero na matemática. As quatro alternativas são distintas.

## Tema da memória

Os oito pares são Aurora, Capivara, Raposa, Coala, Preguiça, Corujão, pai e mãe da Aurora. Não há sapo ou libélula nesse tema. As imagens são enquadramentos das próprias ilustrações, mantendo os arquivos originais:

- `public/images/aurora-turma-bosque.jpg`: seis protagonistas, de O Bosque Está Chamando.
- `public/images/aurora-pai.jpg`: pai de boné e camisa laranja, da aventura da comilona.
- `public/images/aurora-mae.jpg`: mãe junto à janela com o mapa, do mistério do brilha-escuro.

Enquadramento em SVG aproveita as imagens completas sem criar oito arquivos recortados. Os demais três temas continuam disponíveis. Os livros chamam os animais por suas espécies; não foram inventados nomes próprios.

As cenas auxiliares `aurora-riacho.jpg` e `aurora-lago.jpg`, consultadas antes da escolha dos pais, ficam em `materiais-originais/referencias-visuais/`. Não são publicadas nem carregadas nos jogos.

## Escrita por posições

Em ABELHA, clicar A produz `A_____`; o A final só aparece quando a criança chegar à última posição e clicar A novamente. Todas as teclas continuam disponíveis para permitir repetições. O número 5 solicita CINCO. Acentos corretos aparecem nas posições reveladas; C pode representar Ç, A pode representar Ã/Á. Hífens aparecem automaticamente e não exigem uma tecla extra.

## Centralização e efeitos dos quadros

`components/QuadroFigura` compartilha o enquadramento de palavrinhas, escrita, descobertas e cores. O quadro pode ficar inclinado, mas seu conteúdo usa rotação compensada e permanece centralizado nos dois eixos. A animação está em uma terceira camada, sem substituir a inclinação. `FiguraConteudo` usa flex em vez de participar da linha de texto, e os números de dois/três dígitos têm tamanho ajustado para caber.

Nas palavrinhas, somente a figura revelada ao vencer respira continuamente, em ciclo de 2,2 segundos. Trocar a palavra remove a animação. Escrita, descobertas e cores usam um salto breve ao acertar. A forca anima as estrelas de vitória. A memória mantém seu brilho e salto curtos de par encontrado, com o tabuleiro alinhado. Nas contas, o resultado aparece com uma entrada breve; antes do acerto o espaço fica vazio, com apenas a borda alaranjada. Todos os efeitos respeitam movimento reduzido.

## Ponto de partida e próxima rodada

Forca e palavrinhas exibem uma pista inicial gratuita em todas as rodadas. O builder de palavras incorpora esse conteúdo ao contrato da rodada, consumido pelos dois jogos. A pista é distinta das dicas da lâmpada e não reduz as três dicas do fácil nem a única do difícil.

`components/AvancoRodada` e `hooks/useAvancoAposSucesso` compartilham a apresentação após a vitória: primeiro permanece a comemoração; após 1,5 segundo aparece a seta circular “Próxima”, com respiração suave. O quadro mantém tamanho e posição; o botão é posicionado fora do fluxo, sem recentralização. Nas telas pequenas, seu espaço fica reservado abaixo da figura desde o início, evitando sobreposição e deslocamentos quando aparece. Nas contas, painel e tipografia também permanecem iguais. Cada consumidor usa a chave da rodada; o temporizador é cancelado ao desmontar, sair ou trocar o nível. A memória mantém seu botão de embaralhar, sem esse avanço.

`components/BotaoReiniciar` padroniza os botões de trocar palavra/figura/desafio e embaralhar com a mesma seta circular. A seta para a direita identifica avançar após uma vitória; a circular identifica trocar ou recomeçar. Os efeitos respeitam movimento reduzido e os botões têm nomes acessíveis e foco visível.

## Idioma do conteúdo educativo

Cada jogo oferece Brasil (pt-BR), Estados Unidos (en-US) e Espanha (es-ES), à esquerda da dificuldade. O padrão acompanha o idioma da aplicação. A seleção individual permanece enquanto a aplicação está aberta, até uma nova troca de idioma no cabeçalho. Essa troca global redefine todos os jogos para o novo idioma. Se o idioma efetivo do jogo mudar, inicia uma rodada limpa, mantendo o nível. A chave da página inclui jogo, nível e idioma, desmontando os temporizadores e eventos anteriores.

Esse seletor dos jogos altera apenas as respostas e legendas educativas; é possível praticar outro idioma sem mudar a interface. O cabeçalho escolhe interface, perguntas, instruções, pistas iniciais e dicas, além de redefinir o padrão educativo (veja a seção seguinte). Forca, palavrinhas e escrita usam a grafia do idioma escolhido no jogo; descobertas e cores usam nomes nesse idioma nas alternativas. A memória muda as legendas, preservando imagens e pares. As continhas continuam com algarismos e símbolos, iguais nos três idiomas.

Mapa de responsabilidades: vocabulário comum e normalização → domínio palavras, catálogos e builders próprios, expostos por `consultarNome`, `consultarAlfabeto` e `normalizarEntrada`; nomes de formas/números → descobertas; cores → cores; legendas específicas → memória. Descobertas e memória consultam a API pública de palavras para nomes comuns, sem acessar seus internos. Seletores são apresentação compartilhada; a seleção de cada jogo pertence ao shell. Não há serviço externo de tradução nem novas dependências.

Exemplos: ABELHA → BEE → ABEJA; o número 5 pede CINCO → FIVE → CINCO. Acentos são exibidos corretamente e aceitam a letra equivalente sem acento; em espanhol, Ñ permanece uma letra distinta de N e está no teclado. Espaços e hífens aparecem automaticamente e não exigem digitação. Aurora conserva o nome próprio; os nomes descritivos dos animais seguem o vocabulário selecionado. Os limites de tamanho de fácil/difícil nas palavras consideram a grafia selecionada. Dicas sobre iniciais, rimas ou tamanho que só valiam em português foram adaptadas, ainda em português, sem alterar a quantidade disponível.

## Tradução da interface e loading padrão

Pedido posterior autorizado: traduzir toda a interface para pt-BR/en-US/es-ES, preservando a marca, os desafios e colocando o áudio em standby. A fachada técnica global fica em `contexts/interface/index.js`, com um Provider porque todos os componentes da árvore realmente compartilham o idioma. Não é um novo domínio de jogo; é infraestrutura global de apresentação, consumida pelo shell e componentes. Catálogos ficam em `contexts/interface/mensagens/`; o builder próprio resolve mensagens e parâmetros, e regras próprias validam os três idiomas. Não foram adicionadas dependências nem alterado o AGENTS.md.

Há 522 mensagens por catálogo estrangeiro, cobrindo início, títulos, menus, seletores, instruções, feedback, dicas, pistas iniciais, temas, aria-labels e descrições de imagens. Português é a fonte. Os catálogos estrangeiros são chunks carregados sob demanda. A tradução ocorre na apresentação; mudar o padrão educativo pela interface pode iniciar outra rodada, sem alterar a dificuldade. Variáveis mantêm os valores educativos: interface inglesa com desafio ajustado manualmente para português pode dizer “The word was ABELHA”. A marca permanece Aventuras da Aurora.

O seletor compacto reutiliza as bandeiras dos jogos, com imagens menores e área de toque de 44px. Fica à direita da marca, na mesma linha, inclusive em telas estreitas; o menu ocupa a linha seguinte e permite rolagem horizontal. `document.documentElement.lang` e o título da aba acompanham a interface. Ao recarregar, o idioma é identificado novamente pelas preferências do navegador; não foi criada persistência.

## Idioma automático e sincronização dos desafios

Pedido autorizado: acompanhar o idioma global nas bandeiras dos jogos e escolher o idioma inicial dinamicamente. O Provider de interface agora coordena também as preferências de idioma dos desafios, antes guardadas no shell. A fachada expõe `idiomaDoJogo` e `trocarIdiomaDoJogo`; o shell mantém somente a dificuldade por jogo. Após carregar com sucesso outro idioma de interface, o Provider atualiza o catálogo e limpa as escolhas individuais no mesmo commit. Falha de carregamento preserva interface e escolhas anteriores.

`builders/preferencias.js` normaliza as tags de `navigator.languages` e usa `navigator.language` como alternativa. `regras.js` escolhe o primeiro idioma compatível, em ordem de preferência: qualquer variante de português → pt-BR; inglês → en-US; espanhol → es-ES. Exemplos: pt-PT → pt-BR, en-GB → en-US e es-MX → es-ES. Sem correspondência ou com informações indisponíveis, o padrão é en-US. A identificação acontece somente na abertura; não substitui uma escolha manual durante a sessão. [Preferências fornecidas pelo navegador](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages).

Essa identificação não é geolocalização: alguém nos EUA com navegador configurado em português pode receber português. Para país físico seria necessária outra fonte, como dados de infraestrutura/consulta de IP ou localização com consentimento, que não foram adicionados. A implementação atual dispensa serviços externos, permissões de localização e mudanças no contrato de persistência.

A inicialização automática de inglês/espanhol usa o loading da flor já na primeira renderização, com a legenda de destino, enquanto o catálogo é carregado. O efeito de carregamento suporta cancelamento e a remontagem de efeitos do StrictMode, evitando que o temporizador cancelado trave a primeira abertura. Uma falha mantém a interface base disponível com mensagem de erro para nova tentativa manual.

`components/Carregamento` é o único padrão de overlay para carregamentos: verde escuro `rgba(8, 43, 30, .48)`, desfoque leve, flor SVG de 92×108px e legenda no idioma de destino. As oito pétalas caem em sequência e reaparecem juntas ao final de cada ciclo de 3,6s. A troca de idioma mantém uma janela mínima de 900ms para evitar flashes do overlay em catálogos já em cache. Não há spinner alternativo de folha, pois a opção da flor é viável.

Enquanto carrega, o conteúdo fica inert, o scroll e o teclado dos jogos são bloqueados e o foco vai para o status; ao finalizar, o foco e o scroll são liberados. A preferência por movimento reduzido deixa a flor estática. Falha no catálogo mantém o idioma anterior e mostra uma mensagem traduzida com opção de tentar novamente pelo seletor. Timers e listeners são limpos ao desmontar.

## Verificação

51 testes cobrem regras antigas e novas, os três idiomas nos dois níveis, pistas iniciais para todo o vocabulário sem consumir dicas, quatro alternativas únicas, ausência de repetição imediata, pais no tema da memória, limites aritméticos, divisão exata, Ñ, separadores e escrita letra a letra. Outros 11 testes cobrem seleção e reprodução de voz com a API do navegador simulada, incluindo a tentativa em inglês/espanhol quando só vozes portuguesas são enumeradas. Lint e build verificam integração e sintaxe. As 42 combinações de jogo/nível/idioma também foram renderizadas estaticamente com seus seletores, quatro botões de áudio somente em Descobertas e ausência de botões aninhados. Renderização estática é uma verificação de composição; não substitui interação, toque, responsividade, audição ou animações em um navegador real.

Além das verificações anteriores, sete testes de interface cobrem paridade dos catálogos, parâmetros, dicas de todos os bancos, mensagens dinâmicas, preservação da marca/respostas e validação de idiomas: total de 69 testes aprovados. A renderização estática cobre as 126 combinações de interface × jogo × dificuldade × idioma educativo, além do shell e das três legendas do loading. Lint e build de produção passaram. A conferência visual/funcional real permanece pendente: os navegadores headless instalados encerraram durante a inicialização neste ambiente; não houve validação de foco, animação ou viewport em uma sessão de navegador.

Na alteração de sincronização/detecção, passaram 13 testes relacionados de idioma/interface, incluindo seis novos casos de preferências, regiões, normalização, ausência de informações e fallback inglês. Também passaram lint localizado, build e renderização estática das combinações existentes, com verificações adicionais da bandeira padrão dos jogos nos três idiomas globais e do loading inicial para português, inglês, espanhol e um idioma não suportado. A interação assíncrona no navegador real continua pendente.

## Áudio de Descobertas — em standby

Estado atual: desativado a pedido do usuário. Os imports, a chamada do hook e os pontos de composição foram comentados em `pages/descobertas/jogar/index.jsx`. Serviço, fachada, botão, estilos, testes e catálogo de gravações estão preservados. Não há botões de áudio nas telas nem inicialização de síntese. A descrição abaixo registra o funcionamento da implementação preservada, para retomada futura.

Somente Descobertas oferece um alto-falante por alternativa, inclusive após uma tentativa ou vitória. Os cards têm altura mínima de 78px, com conteúdo centralizado nos dois eixos e espaço lateral simétrico. O alto-falante tem círculo visível de 34px e ícone de 18px, preservando a área de toque de 44px. O botão de áudio e o de resposta são irmãos no HTML; ouvir não marca a alternativa. Cada ação tem nome acessível e foco visível. Uma indicação discreta identifica a palavra em reprodução. Erros e indisponibilidade aparecem em uma região de status em português, preservando o funcionamento do jogo.

Mapa: `services/descobertas/index.js` integra `speechSynthesis`/`SpeechSynthesisUtterance`, sem React ou regras do jogo; `contexts/descobertas/index.js` coordena disponibilidade, estado e cancelamento via `useVozDescobertas`; `utils/selecionarVoz.js` escolhe uma voz de forma pura. O botão pertence à página de descobertas. Os componentes compartilhados recebem somente slots opcionais de apresentação, preservando as demais partidas.

A preferência é pelo idioma e região exatos, depois por outra voz do mesmo idioma. Nomes reconhecidos como femininos recebem prioridade e vozes identificadas como naturais recebem preferência adicional. A API não fornece um atributo de gênero: essa preferência é uma heurística e não garante voz feminina, infantil ou qualidade uniforme. A velocidade é 0,9 e a altura permanece natural (1). Quando não encontramos uma voz compatível na lista, não bloqueamos a leitura: enviamos `lang` sem fixar `voice`, deixando o navegador escolher. Não atribuímos uma voz portuguesa à leitura estrangeira. Indisponibilidade de idioma só é informada se o sintetizador retornar `language-unavailable` ou `voice-unavailable`. [Escolha automática de voz pelo idioma](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/voice).

Uma nova reprodução cancela a anterior, sem enfileirar palavras. Trocar rodada, nível, idioma ou sair desmonta o leitor, cancela a fala e remove o listener de vozes. Eventos tardios são ignorados. Não há reprodução automática nem novas dependências, gravações ou serviço pago de áudio. Os testes simulados cobrem os três idiomas, carregamento tardio, repetição, cancelamento, erros e ausência da API; a avaliação de pronúncia e suavidade permanece para o navegador real.

O usuário testa no Brave e também deseja uso em celulares. A síntese nativa não garante vozes nos três idiomas em todos esses ambientes. No Windows acessível nesta sessão, o registro enumera Maria/Daniel em português e Zira Desktop em inglês; nenhuma voz espanhola foi encontrada nessas duas fontes. Esse inventário do sistema não comprova quais vozes o Brave expõe. A ferramenta de navegador não apresentou nenhuma sessão conectada para teste real.

Para independência das vozes instaladas, foi preparado `docs/catalogo-audios-descobertas.json`: 168 entradas, 56 por idioma, com o texto e nome previsto do MP3. Trata-se apenas do catálogo de produção; não existem MP3 nem referências novas a arquivos ausentes na aplicação. A geração ainda depende de uma ferramenta de síntese disponível ou de gravações fornecidas. O player de arquivos será integrado quando os áudios puderem ser produzidos e verificados.
