# Aventuras da Aurora

Uma aplicação infantil para aprender brincando, destinada a crianças de 5 a 8 anos. React/Vite, MUI e styled-components, com interface em português brasileiro, inglês e espanhol.

## Publicação e materiais originais

Veja [o preparo para GitHub e Vercel](docs/publicacao.md). Cada jogo, a leitura e a pintura carregam somente ao abrir a respectiva página. O início permanece disponível sem esperar os módulos dos jogos.

Os materiais originais locais ficam em `materiais-originais/`, ignorada pelo Git e pelo Vercel; as traduções editoriais permanecem na pasta externa FINALS. Os derivados necessários à aplicação ficam em `public/`: os dois PDFs gratuitos do Bosque por idioma (seis no total), suas páginas de leitura/pintura, máscaras, miniaturas, capas e artes em uso. O código de áudio permanece em standby.

O padrão de rolagem usa galho com cipó, joaninha no horizontal e no vertical. Funciona no menu, na página, no leitor ampliado, nos modais e na paleta de pintura quando houver overflow. Toque, trackpad, roda do mouse e teclado continuam nativos; o controle também pode ser arrastado. Animações respeitam movimento reduzido. Veja [o componente e a integração de novas áreas roláveis](docs/rolagens-bosque.md).

Uma segunda faixa no rodapé apresenta `© 2026 — Desenvolvido por HIVETRON TECHNOLOGY`, com a expressão de crédito traduzida e o nome da empresa preservado. Usa o logo fornecido e fontes locais em `public/fonts/`: Goldman Regular e KyivType Sans Regular, copiadas sem alteração da instalação disponibilizada pelo proprietário. As licenças acompanham os arquivos. Não depende de Google Fonts/CDN ou das fontes instaladas no dispositivo de quem acessa.

## Formatação e verificação do código

O padrão segue a indentação adotada no projeto: 2 espaços, aspas duplas, ponto e vírgula, vírgula final, largura preferencial de 80 colunas e finais de linha LF. Configuração em `.prettierrc.json` e `.editorconfig`, documentada em STY-02 do AGENTS.md. O VS Code formata JS/JSX e JSON ao salvar; as extensões necessárias estão recomendadas em `.vscode/extensions.json`.

```sh
npm run format
npm run format:check
npm run lint
npm test
npm run build
```

`format` aplica o padrão; `format:check` apenas confere; `lint` executa ESLint e a conferência do Prettier. CSS dentro de styled-components é formatado pelo Prettier. Não há regras de indentação duplicadas no ESLint nem diagnósticos de CSS desativados. Assets, livros, fontes, backups, lockfile e AGENTS.md ficam fora da formatação automática.

Prettier 3.7.4 é dependência de desenvolvimento, na mesma versão fornecida pela extensão já instalada. Nesta manutenção, a instalação de rede estava indisponível: a cópia local foi aproveitada, com versão, URL pública e integridade registradas a partir do lockfile oficial da extensão. O lockfile foi normalizado pelo npm em modo offline; `npm ci` em outro computador usa o registro público, sem depender de caminhos locais.

Revisão após a indentação: ESLint aprovado; 297 templates de estilo sem diagnósticos no analisador da extensão styled-components; 146 testes aprovados; build de produção aprovado. Os avisos em estilos dinâmicos foram corrigidos preservando bordas, animações e intervalos de queda das pétalas. O carregador de testes usa a árvore sintática para aceitar imports multilinha, sem depender da formatação do código. A aprovação visual já fornecida pelo proprietário permanece registrada.

## Executar

Requer Node.js 22.13 ou superior.

```sh
npm ci
npm run dev
```

O terminal informa o endereço local, normalmente `http://127.0.0.1:5173`. Se as dependências já estiverem instaladas, basta `npm run dev`.

```sh
npm test          # regras e montagem das rodadas
npm run lint     # código da aplicação, testes e configuração Vite
npm run build    # produção em dist/
npm run preview  # servir o build localmente
```

O carregador `runner` do Vite evita empacotar a configuração em um processo esbuild separado, o que permite executar o projeto no ambiente Windows com permissões restritas usado nesta criação.

## Brincadeiras disponíveis

- **Forca do bosque:** seis erros por palavra, teclado virtual ou físico, dicas progressivas, revelação de todas as ocorrências e novas rodadas.
- **Cadê a letrinha?:** letras faltantes, todas as ocorrências da mesma letra ocultadas, pistas e tentativas livres. Sempre fica alguma letra visível.
- **Amigos da memória:** tabuleiro fixo 4×4 com oito pares. O tema padrão é a turma dos livros, incluindo pai e mãe de Aurora; floresta, fundo do mar e brinquedos continuam disponíveis.
- **Pedacinhos de aventura:** quebra-cabeça com quatro temas e três imagens por tema, nove peças no fácil e dezesseis no difícil. Arraste ou selecione por clique/teclado para encaixar; ao completar, confetes e um quadro pronto. Veja [os detalhes do jogo](docs/quebra-cabeca.md).
- **Sequências da Aurora:** complete padrões de figuras ou progressões numéricas.
- **Quantos há no bosque?:** conte o modelo em quadros completos de dez figuras (fácil) ou vinte (difícil), sempre em linhas de cinco.
- **Cada coisa em seu lugar:** classifique figuras por arraste ou seleção; o difícil tem quatro coleções de seis itens cada.
- **Qual é a primeira letrinha?:** complete a letra inicial ou a primeira sílaba em português, inglês ou espanhol.
- **A história embaralhada:** dez historinhas com três a cinco cenas para ordenar. Troque cenas por arraste e confira; a claquete abre a história ilustrada como dica. Peças e encaixes mantêm dimensões iguais. Veja [os níveis e a arquitetura dessas cinco aventuras](docs/novas-aventuras.md).
- **Um mundo de cores:** dez cores básicas ou oito tonalidades avançadas, com quatro alternativas e novas rodadas.
- **O que é isso?:** identificar figuras, formas geométricas e números entre quatro alternativas.
- **Continhas da turma:** completar uma operação escolhendo o resultado; soma/subtração no fácil e quatro operações no difícil.
- **Vejo e escrevo:** escrever o nome da figura ou do número por extenso, uma letra por posição, inclusive quando a letra se repete.

O banco de forca/palavrinhas tem 68 palavras, incluindo personagens e elementos dos livros. Cada jogo tem seu seletor **Fácil/Difícil**, independente dos outros e ausente da página inicial. No fácil há três dicas; no difícil, uma, nos jogos com pistas. A memória difícil tem prévia mais curta e dispensa legendas; permanece 4×4. Veja [os detalhes dos níveis](docs/jogos-e-niveis.md).

O sorteio evita repetição imediata; o conteúdo finito pode reaparecer. Palavras mantêm a acentuação; o teclado aceita equivalentes sem acentos (A para Ã/Á, C para Ç). Não há cadastro, anúncios, coleta de dados ou serviços externos. As rodadas dos jogos não persistem após recarregar; as pinturas são salvas localmente no navegador.

Forca e palavrinhas também oferecem uma pista inicial gratuita, além das dicas da lâmpada. Após vencer, aguarde 1,5 segundo: surge a seta “Próxima” para iniciar outra rodada, mantendo o quadro no mesmo tamanho e lugar. Esse avanço está nos jogos de respostas; a memória mantém “Embaralhar de novo”, e o quebra-cabeça permite “Montar novamente” ou selecionar outra miniatura. Os botões de trocar/reiniciar usam o mesmo ícone circular.

As bandeiras Brasil/EUA/Espanha dentro dos jogos selecionam o idioma das palavras e começam acompanhando o idioma da aplicação. Trocar o idioma no cabeçalho redefine o padrão de todos os jogos; depois, cada desafio pode ser ajustado individualmente até a próxima troca global. A escrita e os nomes nas alternativas/legendas mudam para português brasileiro, inglês americano ou espanhol da Espanha. Se o idioma da rodada mudar, começa outra rodada no mesmo nível. O espanhol oferece Ñ; espaços e hífens são preenchidos automaticamente. Nas continhas, os algarismos permanecem iguais.

O seletor compacto no canto superior direito escolhe o idioma de toda a interface, inclusive dicas, navegação, feedback, acessibilidade e título da aba, e define o novo padrão dos desafios. A marca Aventuras da Aurora permanece em português. Ao abrir a aplicação, escolhemos o primeiro idioma compatível nas preferências do navegador: português → pt-BR, inglês → en-US, espanhol → es-ES. Sem correspondência ou sem informações, usamos inglês. Isso identifica a preferência linguística, não o país físico; não há consulta de IP/GPS nem serviço externo. A escolha manual prevalece durante a sessão; recarregar detecta novamente as preferências.

Inglês e espanhol são carregados sob demanda; durante a troca ou a inicialização automática nesses idiomas, um overlay verde fumê mostra uma flor cujas oito pétalas caem uma a uma e se recompõem. A legenda já usa o idioma de destino. O componente `Carregamento` é o padrão reutilizável para operações que precisem de loading.

Os efeitos visuais respeitam a preferência de movimento reduzido. A aplicação usa controles grandes, navegação por teclado, foco visível e mensagens acessíveis. O áudio está em standby: imports e pontos de integração foram comentados, preservando botão, serviço, seleção de vozes, testes e catálogo de gravações para retomada futura. Nenhum jogo inicia síntese de voz nem mostra botões de áudio.

## Organização

O contrato completo está em [AGENTS.md](AGENTS.md), adaptado do padrão Waybe ERP 3.4 fornecido pelo usuário. A fonte original está preservada em [docs/padrao-waybe-referencia.md](docs/padrao-waybe-referencia.md).

```text
src/
  app/                         shell e navegação por hash
  pages/<dominio>/<fluxo>/      composição visual, estilos e hooks locais
  contexts/<dominio>/           fachada React pública
    regras.js                  decisões puras
    constantes.js              conteúdo e configurações do domínio
    builders/                  montagem/normalização das rodadas
  components/                  apresentação reutilizada
  hooks/                       interação genérica reutilizada
  styles/                      tema e estilos globais
  utils/                       aleatoriedade genérica
tests/                         regras e contratos de rodada
```

O service de descobertas integra a síntese de voz do navegador, coordenada pela fachada React desse domínio. Não há Providers antecipando integrações. Forca consome o vocabulário pela API pública de palavras; as páginas não importam regras/builders internos. Escrita reutiliza as APIs públicas de descobertas e palavras. Hooks compartilhados cuidam das interações sem decidir o acerto de cada jogo.

MUI mantém seu motor interno Emotion. Os componentes próprios usam styled-components, com o mesmo tema nas duas bibliotecas. Assim não é necessário substituir o motor do MUI por uma versão experimental de `styled-engine-sc`. O pacote de desenvolvimento `yaml` fixa um peer opcional compatível com Vite; a versão antiga exigida por ferramentas transitivas fica isolada no lockfile.

## Artes e conteúdo

A coleção está disponível em **Livros** e no segundo destaque do carrossel automático da página inicial. **O Bosque Está Chamando** tem leitura gratuita das 38 páginas, com setas, contador e zoom, além do download do PDF gratuito. Os outros cinco livros exibem somente capa e título. Capas, títulos, leitura e downloads dos livros e Aurora Goodies acompanham o idioma da interface: português, inglês ou espanhol. Veja [a organização e os limites do leitor](docs/livros.md) e [as edições por idioma](docs/livros-idiomas.md).

A imagem da página inicial e os retratos dos personagens são ilustrações originais extraídas dos livros. A extração preserva os pixels e mantém os PDFs intactos. Os outros temas usam pictogramas Unicode, que podem variar entre sistemas. Os seis PDFs originais permanecem intactos.

O visual usa cores mais vivas inspiradas nas ilustrações. As cartas da memória mantêm suas cores na prévia e após encontrar o par. A folha do logo e os textos foram preservados. Veja [a origem da arte e os ajustes visuais](docs/visual-dos-livros.md).

Há um ponto de restauração anterior a essas mudanças em `backups/aurora-antes-visual-livros-20261022-230503.zip`, incluindo código, assets, configurações, build e livros. O manifesto registra os hashes; [as instruções de restauração](backups/COMO-RESTAURAR.md) identificam o checkpoint. Dependências e caches ficam fora do ZIP.

A seção **Colorir** apresenta os seis Aurora Goodies. O Bosque oferece 32 desenhos gratuitos, paleta, preenchimento por região, pincel preso à região inicial, desfazer, ampliação ajustada à tela, salvamento automático neste navegador, título editável e download da pintura. Há também download do PDF gratuito para imprimir. Os demais volumes mostram somente as capas. A entrada está no menu e no terceiro banner do carrossel, que mantém o intervalo de cinco segundos e a pausa por mouse/foco. Veja [a arquitetura, preparação e limites da pintura](docs/colorir.md).

Os tabuleiros 6×6/8×8 continuam fora do escopo.

## Verificação desta criação

As dependências foram preparadas a partir de instalações locais já disponíveis, sem alterar os projetos de origem, porque o registro npm estava bloqueado no ambiente. O lockfile foi normalizado pelo npm em modo offline; ele usa pacotes de registros públicos e não depende dos caminhos dos projetos de origem.

Testes de regras, lint, build, árvore de dependências e entrega HTTP local são as verificações disponíveis. Não havia navegador conectado nesta sessão; aparência, toque e comportamento visual ainda precisam de revisão no navegador. Testes puros não comprovam temporizadores ou jornadas React completas.
