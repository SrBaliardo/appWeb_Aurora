# Aventuras da Aurora 🌿

Um espaço para crianças de **5 a 8 anos** aprenderem brincando no universo dos livros da Aurora: jogos educativos, histórias ilustradas e desenhos para colorir.

Interface em **português brasileiro, inglês e espanhol**, com capas, leitura e downloads no idioma selecionado. Sem cadastro, anúncios ou backend.

## Conheça a plataforma

### Brincadeiras

São 13 jogos com os níveis **Fácil** e **Difícil**, escolhidos dentro de cada brincadeira.

| Jogo | Atividade |
| --- | --- |
| Forca do bosque | Descobrir palavras com pistas e tentativas |
| Cadê a letrinha? | Completar as letras que faltam |
| Amigos da memória | Encontrar oito pares no tabuleiro 4×4 |
| Pedacinhos de aventura | Montar quebra-cabeças de 9 ou 16 peças |
| Sequências da Aurora | Completar padrões de figuras e números |
| Quantos há no bosque? | Contar figuras entre outros elementos |
| Cada coisa em seu lugar | Organizar itens em coleções |
| Qual é a primeira letrinha? | Identificar letras e sílabas iniciais |
| A história embaralhada | Colocar cenas de pequenas histórias em ordem |
| Um mundo de cores | Reconhecer cores e seus nomes |
| O que é isso? | Identificar objetos, formas e números |
| Continhas da turma | Resolver operações matemáticas |
| Vejo e escrevo | Escrever nomes de figuras e números, letra por letra |

Nos jogos com conteúdo linguístico, as bandeiras permitem praticar palavras em outro idioma, independentemente do idioma da interface. As rodadas podem continuar sem limite; o banco de conteúdo é finito e pode reaparecer.

### Livros e Aurora Goodies

- **Livros:** conheça os seis volumes da coleção. *O Bosque Está Chamando* oferece leitura gratuita das 38 páginas, com navegação e zoom, além do PDF para baixar.
- **Colorir:** o Aurora Goodies do Bosque oferece 32 desenhos, paleta, balde de tinta, pincel limitado à região, desfazer, ampliação e download da pintura. Também é possível baixar o PDF para imprimir.
- **Três idiomas:** capas, títulos, páginas de leitura e PDFs gratuitos acompanham o idioma da interface. Os demais volumes apresentam somente capa e título.

As pinturas e os títulos personalizados são salvos automaticamente **neste navegador e dispositivo**, usando IndexedDB. Não há sincronização entre aparelhos; para guardar uma cópia, use o download da pintura.

### Uma experiência infantil

Controles grandes, suporte a teclado e toque, feedback acolhedor e animações que respeitam a preferência de movimento reduzido. A navegação usa galhos, cipós e joaninhas, acompanhando o visual do bosque. O áudio está preservado no código em standby e não é exibido na interface.

## Executar no computador

Requer **Node.js 22, a partir de 22.13**, e npm.

```sh
git clone https://github.com/SrBaliardo/appWeb_Aurora.git
cd appWeb_Aurora
npm ci
npm run dev
```

Abra o endereço informado pelo terminal, normalmente `http://127.0.0.1:5173`.

## Comandos úteis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Iniciar o ambiente de desenvolvimento |
| `npm run lint` | Verificar ESLint e formatação |
| `npm run format` | Aplicar a formatação do projeto |
| `npm run format:check` | Conferir a formatação sem alterar arquivos |
| `npm test` | Executar os testes automatizados |
| `npm run build` | Gerar a versão de produção em `dist/` |
| `npm run preview` | Conferir localmente o build gerado |

O padrão de código usa 2 espaços, aspas duplas, ponto e vírgula e finais de linha LF. As configurações do editor e do Prettier acompanham o repositório.

## Publicar no Vercel

Importe o repositório GitHub no Vercel. O arquivo `vercel.json` já define:

| Configuração | Valor |
| --- | --- |
| Framework | Vite |
| Instalação | `npm ci` |
| Build | `npm run build` |
| Diretório de saída | `dist` |
| Node.js | 22.x, definido pelo `package.json` |

Não são necessárias variáveis de ambiente. As rotas usam hash, como `#/livros` e `#/colorir`. Jogos, leitura e pintura são carregados sob demanda.

Mantenha o `package-lock.json` versionado junto do `package.json`: ele inclui as dependências opcionais de Windows, Linux e outras plataformas necessárias à instalação reproduzível. Detalhes em [Publicação e materiais](docs/publicacao.md).

## Estrutura do projeto

React e Vite, com MUI e styled-components. MUI mantém o motor Emotion; os componentes próprios usam styled-components com tema unificado.

```text
src/
  app/                     Shell, rotas e navegação
  pages/                   Páginas, componentes, estilos e hooks locais
  contexts/                Fachadas dos domínios, regras e builders
  services/                Integrações técnicas e persistência
  components/              Componentes compartilhados
  hooks/                   Hooks compartilhados
  styles/                  Tema e estilos globais
  utils/                   Funções genéricas
public/                    Assets usados pela aplicação
tests/                     Testes de regras, contratos e componentes
scripts/                   Preparação editorial e ferramentas auxiliares
docs/                      Documentação técnica
```

O contrato de engenharia está em [AGENTS.md](AGENTS.md).

## Conteúdo e documentação

`public/` contém somente os materiais necessários ao site: capas, artes, fontes, páginas de leitura, desenhos, máscaras e **dois PDFs gratuitos por idioma**. Os interiores e PDFs dos demais volumes não são publicados.

Materiais editoriais originais, dependências, builds e arquivos temporários ficam fora do versionamento. As fontes usadas na preparação editorial não são necessárias para executar ou construir a aplicação.

- [Coleção e leitor](docs/livros.md)
- [Livros e Goodies por idioma](docs/livros-idiomas.md)
- [Pintura, salvamento e limites](docs/colorir.md)
- [Jogos e dificuldades](docs/jogos-e-niveis.md)
- [Novas aventuras educativas](docs/novas-aventuras.md)
- [Quebra-cabeça](docs/quebra-cabeca.md)
- [Rolagem personalizada](docs/rolagens-bosque.md)
- [Preparação para GitHub e Vercel](docs/publicacao.md)

© 2026 — Desenvolvido por **HIVETRON TECHNOLOGY**.
