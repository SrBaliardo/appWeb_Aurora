# Preparação para GitHub e Vercel

## Conteúdo do repositório

Versionar `src/`, `public/`, `tests/`, `scripts/`, `docs/`, configurações, README, AGENTS.md e package-lock.json. `node_modules/`, `dist/`, caches, temporários, backups, `.vercel/`, arquivos `.env` e `materiais-originais/` são ignorados. Não inicializar Git dentro de `materiais-originais/`.

Os 526 arquivos originais foram movidos para `materiais-originais/`, preservando os nomes e a estrutura interna de `livrosColorir/`. `inventario-sha256.json` nessa pasta registra tamanho/hash dos arquivos, conferidos após a movimentação. Essa pasta precisa de backup próprio: Git não a protege. As referências auxiliares do lago e riacho ficam em `materiais-originais/referencias-visuais/`.

`public/` é inteiramente público. Contém seis capas de livros e seis capas de Aurora Goodies por idioma, os retratos e a arte usados pela plataforma e somente os interiores/PDFs gratuitos do Bosque. São seis PDFs gratuitos no total, dois por idioma; os demais volumes publicam somente capas. As máscaras v1 continuam necessárias para recuperar pinturas antigas; não são sobras. As fontes editoriais não são necessárias para instalar, testar, construir ou executar o site. Veja [as edições por idioma e seu manifesto](livros-idiomas.md).

SHA-256 dos downloads gratuitos em português, congelados nos testes (traduções registradas em `scripts/traducoes/manifesto.json`):

- Livro: `845c3a6dabf3e4003b9e64f34131d3a39db13770f6e54158d6ac6ce68308b007`.
- Aurora Goodies: `a9f6fc24dc0e6ef8163dd1350e330bc14ed2508375f9d4d95c050fb043149eaa`.

## Verificar e construir

Node.js 22, a partir de 22.13. O `package.json` limita a versão principal a 22 para manter compatibilidade com o ambiente validado e evitar atualizações automáticas para outra versão principal no Vercel:

```sh
npm ci
npm run lint
npm test
npm run build
npm run preview
```

Verificar também no navegador: as 13 brincadeiras nos dois níveis, os três idiomas, navegação direta/recarregamento, leitura e downloads, pintura com mouse/toque, reabertura do progresso e falha de armazenamento. A confirmação de saída permite tentar salvar novamente, baixar uma cópia, continuar ou sair sem salvar as últimas alterações. IndexedDB continua local ao aparelho, navegador e origem; trocar de domínio não transfere pinturas.

## Publicar

Criar o repositório GitHub na raiz do projeto, revisar os arquivos antes do primeiro commit e conectar esse repositório ao Vercel. Não enviar manualmente a pasta inteira. O `vercel.json` declara Vite, `npm run build` e saída `dist`. Não há variáveis secretas, backend ou funções a configurar. As rotas usam hash (`#/memoria`, `#/colorir`), sem necessidade de rewrites de SPA.

O deploy continua pendente de criação/conexão das contas e do repositório. Selecionar um plano compatível com a utilização; ausência de loja não determina, por si só, que o uso é não comercial. Não há publicação automática executada por esta tarefa.

## Carregamento e manutenção

`src/app/paginas.js` declara imports dinâmicos por página; React reutiliza os módulos após o primeiro carregamento. `LimitePagina` mantém o shell disponível em caso de falha, com retorno ao início e nova tentativa por recarregamento, que também busca o HTML atual após um deploy.

Otimização opcional, sem ferramentas externas:

```sh
node scripts/otimizar-png.mjs
node scripts/otimizar-png.mjs --aplicar
```

O script preserva integralmente o fluxo descomprimido e os metadados PNG; só escreve quando reduz o tamanho. Artes e máscaras v1 com hashes históricos são excluídas. Não modifica PDFs, JPEGs, dimensões, cores, IDs de regiões ou contratos de progresso. Depois de aplicar, executar os testes da pintura e o build.

`scripts/preparar-livros.ps1` preserva a preparação das seis capas e das páginas de leitura do Bosque a partir dos PDFs em `materiais-originais/`. Requer Windows/WinRT e System.Drawing, assim como a preparação dos Goodies requer System.Drawing. Essas ferramentas editoriais não participam do build no Vercel.

## Evidências da etapa anterior de limpeza

- Lint geral aprovado; 130 testes gerais aprovados, mais um novo teste de recuperação de falha de página aprovado na verificação localizada posterior.
- Build de produção aprovado: JavaScript principal passou de 470,39 kB (gzip 157,45 kB) para 293,35 kB (gzip 99,61 kB), com jogos em chunks separados.
- Arquivos públicos passaram de aproximadamente 173,27 para 169,11 MiB, sem mudar os pixels. Os dois PDFs gratuitos mantêm os hashes originais.
- Conferência HTTP local do build: início, 33 chunks, arte, leitura, máscaras e dois downloads disponíveis; materiais originais não publicados.
- 21 renderizações estáticas de coleção, galeria, editor e banners nos três idiomas aprovadas. São verificações estáticas, não interação real no navegador.
- Git conferido em repositório temporário: somente os dois PDFs gratuitos são candidatos a versionamento; materiais, backups, temporários, dependências e variáveis locais são ignorados. Não havia repositório Git criado na raiz; `git diff --check` da árvore existente não se aplica.
- As conferências visuais foram posteriormente consideradas concluídas pelo usuário.
- Exclusão definitiva de temporários/caches rejeitada pela revisão automática de permissões do ambiente. Alternativa reversível executada: arquivos de desenvolvimento antigos, caches e pastas vazias arquivados em `backups/arquivo-desenvolvimento-20261024-194941/`, ignorado pelo Git e pelo Vercel. O checkpoint visual foi posteriormente removido por solicitação do proprietário.

## Ampliação com edições traduzidas

Com as edições em inglês e espanhol, `public/` ocupa aproximadamente 443,5 MiB. Os seis PDFs gratuitos têm menos de 100 MiB cada. Nenhum PDF dos outros volumes foi publicado; as páginas de pintura continuam compartilhadas entre idiomas. A preparação editorial das traduções usa `scripts/preparar-traducoes.ps1` e fontes externas em FINALS, sem participar do build no Vercel.
