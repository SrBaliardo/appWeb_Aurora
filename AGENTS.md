# AGENTS.md

## Padrão de Engenharia Frontend — Aventuras da Aurora

**Versão:** 1.1 (adaptada do Waybe ERP 3.4)
**Status:** obrigatório em desenvolvimento/manutenção/refatoração/testes/review.
**Escopo:** aplicação infantil React/Vite appWeb_Aurora, público de 5 a 8 anos. Referência preservada em docs/padrao-waybe-referencia.md. PDFs são fontes e não devem ser alterados.

# 1. CONTRATO OBRIGATÓRIO

## GOV-01 — Autoridade, carregamento e interpretação

Ler o documento completo antes de criar/alterar/revisar código. Sistema/desenvolvedor e segurança/permissões do ambiente prevalecem; no projeto: segurança/integridade → pedido explícito autorizado → padrão → legado. Níveis A=invariantes, B=arquitetura, C=processo, D=review; inferior não flexibiliza superior.

Pedido genérico não derroga invariantes. Conflito: informar regra, evidência e impacto; resolver apenas a decisão necessária.

Confirmar fonte, versão e escopo; ler por completo. Sem fonte ou evidência, informar lacuna sem presumir conformidade.

Arquivo AGENTS.md UTF-8, até 24 KiB. Não elevar limite ou criar instruções alternativas. Alterar somente por pedido explícito.

## GOV-02 — Evidência e cumprimento

Conclusão exige evidência em código/configuração/contrato/validação. Hipótese não é fato: apontar lacuna/impacto; ausência no trecho não prova ausência no sistema.

Preferência, legado e economia não dispensam regras. Não inventar achados/aprovação. Corrigir no escopo; registrar excedentes.

## INV-01 — Preservação funcional

Sem pedido explícito correspondente, preservar negócio/cálculo, permissão, navegação, validação/mensagem, fluxo, comportamento público, dependência e persistência/cache. Refatoração reorganiza sem mudar comportamento observável; melhoria funcional não relacionada é outra tarefa.

## INV-02 — Contratos

Preservar endpoint/método, headers/auth, parâmetros/paginação, payload/DTO/retorno, erros, download/upload, permissões, chaves/formato de storage, URLs/eventos/props públicas. Mudança exige mapear produtores/consumidores e autorização explícita do contrato.

## INV-03 — Escopo mínimo

Menor conjunto coerente: sem legado adjacente, movimentação fora do pedido ou arquitetura por conveniência. Preservar alterações do usuário; não sobrescrever trabalho alheio.

## INV-04 — Aplicabilidade e legado

- Novo: conformidade integral.
- Correção: trecho alterado não cria/amplia não conformidade; aplicar obrigações pertinentes.
- Refatoração: conformidade integral do módulo autorizado.
- Legado adjacente/shared não alterado: registrar risco relevante, sem correção automática.

Não chamar violação do escopo de legado para liberar, nem exigir modernização total em correção localizada. Risco externo impeditivo de contrato/segurança/funcionamento segue INV-06.

## INV-05 — Checkpoint íntegro

Etapa termina sem import quebrado, chamada desconectada, contrato migrado parcialmente, arquivo necessário sem consumidor, funcionamento incompleto ou mistura funcional/estrutural não autorizada.

## INV-06 — Preservação incerta

Identificar incerteza/impacto; propor menor validação útil; aguardar se não autorizada. Comparação estática não confirma função; sem correção especulativa ou preservação comprovada sem evidência.

# 2. ARQUITETURA DETERMINÍSTICA

## ARC-01 — Conceitos e fronteira

Domínio: capacidade de negócio com vocabulário/operações próprios; funcionalidade: recorte coeso; página: rota/fluxo visual. Componente específico pertence à funcionalidade; compartilhado tem contrato genérico e reutilização real por mais de uma funcionalidade/domínio. Contrato: INV-02.

Rota/nome de tela não prova domínio comum. Reutilizar fronteira inequívoca; dúvida com impactos distintos exige decisão antes de criar/mover (ARC-07).

## ARC-02 — Fachada React do domínio

`contexts/<dominio>/index.js` expõe operações integradas a React, mesmo sem estado compartilhado ou com uma página. Pode exportar `use<Domínio>()`; Provider só para compartilhamento real na árvore.

Sem Provider não desloca fachada para service/hook local. Fachada consome service sem React quando houver integração externa; não duplicar operações/intermediários pass-through.

## ARC-03 — Estrutura canônica

```text
src/pages/<dominio>/<funcionalidade>/
  index.jsx, styles.js (se houver), components/, hooks/
src/contexts/<dominio>/
  index.js, regras.js (se houver), constantes.js (se houver), builders/
src/services/<dominio>/index.js (se necessário)
src/components/, hooks/, utils/, styles/ (compartilhados)
src/app/ (shell e navegação)
tests/ (regras e contratos)
```

## ARC-04 — Princípio de responsabilidade

Página compõe; domínio decide; service integra; builder transforma; componente apresenta; hook encapsula React; util resolve genérico/puro. Sem arquivos/camadas/Providers/builders vazios. Aplicar ARC-06 e LAY.

## ARC-05 — Camadas novas

repositories, adapters, useCases, entities, mappers, formatters ou equivalentes exigem necessidade demonstrada, justificativa e autorização explícita. Não importar arquitetura, biblioteca de estilos ou infraestrutura externa por preferência.

## ARC-06 — Destino obrigatório

Classificar nesta ordem; consumidores, preferência ou simplicidade aparente não mudam destino:

| Responsabilidade | Destino |
|---|---|
| DTO/payload/parâmetros/normalização, inclusive pequenos | `contexts/<dominio>/builders/` |
| Decisão/restrição/cálculo puro de negócio | `contexts/<dominio>/regras.js` |
| Operação de domínio exposta à UI, integrada a React | `contexts/<dominio>/index.js` |
| HTTP/websocket/arquivo/API externa sem React | `services/<dominio>/` |
| Estado/efeito/interação de página | pages/.../hooks/ ou hook shared genérico reutilizado |
| Apresentação/estilo | componente e styles.js |
| Função pura sem domínio | utils/ |

Específicos ficam na funcionalidade; compartilhados na pasta correspondente. Não contornar a tabela movendo contrato/regra/operação para JSX/página/service/util. Não criar service de negócio solto na raiz; preservar infraestrutura transversal existente; novo transversal usa `services/<capacidade>/` com finalidade explícita.

Os quatro jogos têm fachadas próprias. Forca consome vocabulário pela API pública de palavras em dependência unidirecional; sem duplicação do banco ou import de internos alheios.

## ARC-07 — Catálogo e decisão de domínio

| Responsabilidade | Domínio / fachada pública |
|---|---|
| Vocabulário, dicas e letras faltantes | palavras / contexts/palavras/index.js |
| Tentativas, revelação e resultado da forca | forca / contexts/forca/index.js |
| Temas, cartas e pares da memória 4×4 | memoria / contexts/memoria/index.js |
| Cores, alternativas e avaliação da resposta | cores / contexts/cores/index.js |

Início é composição em pages/inicio/explorar, sem fachada vazia. Shell/tema são infraestrutura. Esta etapa exclui pintura, login, backend e memória 6×6/8×8.
Não catalogado: reutilizar fachada inequivocamente correspondente e evidenciar no mapa PROC-06. Nova fronteira/dúvida exige proposta e autorização única antes de criar/mover; reutilizar decisão no escopo. Catálogo só muda por pedido explícito. Não inventar nome nem unificar telas por semelhança.

## DEP-01 — Dependências permitidas

- Pages/hooks locais → fachada própria, componentes/hooks locais/shared, utils genéricos, estilos autorizados.
- Contexts → builders/regras/constantes próprios, services próprios/transversais, utils, infraestrutura global.
- Services → infraestrutura técnica e utils genéricos.
- Regras → constantes próprias e utils genéricos.
- Shared → shared components/hooks, utils, tema/estilos compartilhados.

## DEP-02 — Dependências proibidas

Proibidos: ciclos; shared importar página/estilo; domínio importar estilo de outra página; util depender de página/context/componente; página acessar internals alheios ou service de negócio sem fachada.

Service não depende de React/context/builder/regra/página: recebe contrato preparado/dependências explícitas ou cliente oficial sem React. Storage/auth/token direto só sem abstração oficial compatível; demonstrar incompatibilidade.

## DEP-03 — API pública e entre domínios

APIs públicas: `contexts/<dominio>/index.js` e `services/<dominio>/index.js`; demais internos. Sem reexports indiscriminados. Builders próprios são internos; página recebe transformação por operação nomeada da fachada.

Entre domínios: API mínima/estável unidirecional justificada, reuso realmente genérico ou composição na página/shell. Reuso pontual não autoriza acoplamento nem mover para shared/utils para contornar fronteira.

## LAY-01 — Pages

Composição/roteamento local/coordenação visual, sem HTTP/contrato/negócio complexo/storage direto, efeitos extensos, estilo estático no JSX ou estado derivado duplicado.

## LAY-02 — Contexts

ARC-02/06: responsabilidade única, API pequena/estável, coordenação sem absorver outras camadas ou domínios. Evitar recriação desnecessária; separar estado/ações quando reduzir rerenders.

## LAY-03 — Services

Integração técnica, sem hooks/estado React, negócio/contrato, render/navegação/toast. Retornar resultado/erro à fachada. Codificação de transporte não é regra de domínio.

## LAY-04 — Builders

Contrato determinístico; pode usar regras próprias. Agrupar coesos, sem arquivo por atributo ou builder pass-through. Formatação visual na UI; genérica/pura pode usar utils.

## LAY-05 — Hooks

React local consome fachada (ARC-06); compartilhado não conhece página. Dependências corretas; considerar desmontagem/cancelamento/respostas fora de ordem em efeitos assíncronos.

## LAY-06 — Utils

Genéricos/puramente funcionais quando possível, sem React/domínio. Reuso pontual de contrato não o torna util.

## LAY-07 — Regras puras

Decisão/valor determinístico recebe dados, sem React/efeito/HTTP/storage/UI/fachada/builder/DTO. Fachada expõe regras nomeadas necessárias; UI aplica/apresenta sem duplicar condições.

## CMP-01 — Componentes

Antes de criar, verificar equivalente, composição e contrato. Sem duplicação injustificada ou negócio específico em shared. Adapter exige ARC-05.

Estados normal/loading/vazio/erro/desabilitado, responsividade/teclado/foco aplicáveis. Props seguem INV-02; sem modernizar shared fora do escopo.

## STY-01 — Estilos

MUI + styled-components, styles.js local e `import * as S from './styles';`. Preferir composição/extensão; sem estilo de outra página, CSS duplicado por conveniência ou Tailwind/estratégia paralela não autorizada.

Sem style estático no JSX. Dinâmico só por exigência de API, runtime não representável por prop/CSS variable ou performance demonstrada. Filtrar props/usar CSS properties sem props inválidas no DOM.

Na refatoração autorizada, extrair inline estático para styles.js local (reutilizar/criar componentes estilizados); atualizar JSX/imports preservando aparência/comportamento. Fora do escopo ou em análise/review: só registrar. Inline dinâmico segue as exceções acima.

**STY-02 — Formatação:** seguir `.prettierrc.json`/`.editorconfig`: 2 espaços, aspas duplas, ponto e vírgula, LF e largura 80. Prettier formata JS/JSX e CSS dos templates; `npm run format` aplica e `npm run lint` verifica. Preservar comportamento e diagnósticos.

## FORM-01 — Formulário e estado

Jogos usam estado local e teclado de botões; sem biblioteca de formulário sem necessidade. Formulários complexos futuros exigem decisão de dependência. Não duplicar valor do formulário em useState; derivar calculáveis, centralizar validação fora do JSX e distinguir servidor/formulário/visual. Não globalizar dado de uma página. Mudança de validação requer autorização funcional.

## API-01 — Infraestrutura HTTP

Usar cliente/infraestrutura existente, sem cliente paralelo por página/funcionalidade. Preservar INV-01/02; página não conhece autenticação/headers.

## API-02 — Dados e diagnóstico

Não registrar tokens, credenciais, dados sensíveis ou objetos HTTP completos que possam contê-los; não expor segredo no bundle. Normalizar erros com informações seguras suficientes ao diagnóstico, sem mascarar falhas. Determinismo de contrato segue LAY-04.

## NFR-01 a NFR-05 — Obrigações aplicáveis

- **NFR-01, acessibilidade:** HTML semântico, teclado, foco visível/previsível, rótulos/nome acessível em ícones, foco de modal se infraestrutura permitir; não depender só de cor.
- **NFR-02, segurança:** sem HTML não confiável, bypass de auth/permissão ou exposição sensível em log/URL/storage sem necessidade; validar arquivos/URLs/entradas conforme risco. Nova dependência/API exige autorização.
- **NFR-03, performance:** evitar render/efeito/requisição desnecessários, preservar lazy loading, avaliar dependências pesadas/paginação/virtualização; otimizar com evidência, sem memoização indiscriminada.
- **NFR-04, resiliência:** erro/finalização de loading; prevenir update após unmount e envio duplicado não idempotente quando aplicável; isolar erro quando possível, preservar mensagens.
- **NFR-05, i18n:** preservar estratégia; texto novo segue a área; datas/números/moedas respeitam locale.

# 3. EXECUÇÃO COM BAIXO CUSTO

## Modos

Análise/diagnóstico/review: somente leitura de código/dependências/contratos/consumidores/riscos; sem alteração/formatação/correção ou validação automática não solicitada. Review localizado não vira auditoria.

Correção aplica INV-03/04; novo obedece integralmente; refatoração limita módulo autorizado, preserva contratos/comportamento e usa checkpoints íntegros para responsabilidades relevantes distintas.

## PROC-01 — Implementação autorizada

Pedido explícito autoriza a etapa. Antes: objetivo, áreas/arquivos, preservação, risco e validação sugerida, concisamente. Sem repetir plano/documento/autorização.

## PROC-02 — Nova autorização

Nova autorização antes de ampliar arquivos/escopo relevantes, mudar contrato/endpoint/permissão/validação/negócio/storage/cache, criar dependência/camada/fronteira, refatorar fora do pedido ou validar além de VAL-02. Mudança já especificamente autorizada não exige repetição. Dúvida material pausa só essa decisão; não inferir ampliação.

## PROC-03 — Ações internas

Internos: leitura/busca, diff manual, mecânica indispensável, import/nome/referência quebrado pela etapa. ESLint/fix/diff/repetição: VAL-02. Diff manual não é teste; várias etapas autorizadas não ampliam escopo.

## PROC-04 — Ordem de execução

Modo/escopo → domínio/comportamento → dependências/contratos/consumidores → regras/riscos → informar etapa/mapa → implementar → revisar diff/integridade/destinos → implícitos → resultado → propor só adicional útil → validar autorizado → risco residual.

## PROC-05 — Leitura proporcional

Não ler todo o repositório: expandir só para entender comportamento/contratos/consumidores e fundamentar conclusão. Reutilizar evidência inalterada, agrupar buscas, usar IDs e não repetir decisões. Economia não suprime leitura necessária ou risco.

## PROC-06 — Mapa e consistência

Antes de criar/mover: responsabilidade → domínio canônico → destino (ARC-06/07), poucas linhas e evidência se não catalogado. Integra etapa autorizada; fronteira definida não exige confirmação.

Implementação/review conferem diff/imports/contratos contra o mesmo mapa. Alternativa exige ADR-01. Registrar e reutilizar decisões/desvios no escopo; não oferecer escolhas onde regra já decide.

# 4. VALIDAÇÃO E LIBERAÇÃO

## VAL-01 — Classes de custo

A: lint/type/syntax localizado, diff check e unitário diretamente relacionado de baixo custo. B: suíte relacionada, integração localizada, hook/componente/smoke. C: build, E2E, Storybook completo, análise de bundle ou suíte ampla. Classe não implica autorização de todos os comandos.

## VAL-02 — Permissões de validação

Implementação autorizada inclui verificações proporcionais: lint dos arquivos alterados, testes relevantes de regras/contratos e build de produção para alterações de código/configuração. Configurar essas ferramentas e instalar dependências da stack aprovada integra o bootstrap inicial. Regras puras usam node:test, sem dependência adicional. Não instalar novas ferramentas em manutenção por conveniência.

Diagnosticar antes de corrigir. Sem relaxar regras, ocultar falhas ou alterar testes apenas para passar. Repetir após ajuste relevante/nova evidência. git diff --check quando existir repositório Git. Não executar suíte ampla alheia ao escopo. Análise/review são somente leitura salvo verificação solicitada. Permissões técnicas continuam necessárias. Informar comandos, resultados e limites, inclusive indisponibilidade de navegador.
## VAL-03 — Dispensa

Pode pular testes/dispensar implícitos: não insistir nem executar silenciosamente; registrar não executados/risco, sem anunciar sucesso. Dispensa controla custo, não flexibiliza arquitetura/aprovação. Testes ausentes não reduzem automaticamente nota estática; confiança funcional é independente.

## VAL-04 — Estratégia proporcional

Autorizados: builder/util → unitário; hook → comportamento; componente → interação/acessibilidade/estados; context/service → sucesso/erro/contrato; página → integração; jornada crítica → E2E/caracterização; bug → regressão viável. Legado sem testes não permite mudança insegura nem obriga suíte completa: menor proteção útil.

## VAL-05 — Evidência de validação

Informar comando/escopo/resultado, falhas preexistentes distinguíveis e limitações (mocks/integrações não verificadas). Não mascarar falha, alterar teste só para passar ou tratar não executado como aprovado. Uma tarefa aprovada não prova conformidade universal.

## VAL-06 — Fronteiras verificáveis

Usar lint existente para imports proibidos/resolução/hooks/ciclos configurados e aplicáveis; cobrir lacunas manualmente. Lint não prova sozinho arquitetura/funcionalidade.

Automação ARC/DEP preserva legado e exige tarefa/autorização para plugins/regras/scripts/CI. Falha de lint não autoriza instalar, relaxar configuração ou ampliar varredura. Norma textual não é bloqueio técnico.

## REV-01 — Escopo do review

Review usa mapa/regras da implementação: rota → página → componentes/hooks → fachada/service → builders/regras → shared → contratos/consumidores. Leitura proporcional; shared só pertinente; aplicar INV-04.

## REV-02 — Achados e aplicabilidade

Achado segue REV-03 com arquivo/linha possível e impacto demonstrável. Hipótese não é falha; não aplicável exige motivo. Evidência decisiva ausente fica pendente, não aprovada.

## REV-03 — Entrega e checklist

Achados ordenados: Arquivo; Problema; Evidência; Impacto; Regra; Correção esperada; Severidade; Etapa sugerida. Declarar ausência no escopo, sem omitir risco externo.

Checklist por IDs: GOV/INV (fontes/autoridade/preservação/integridade); ARC/DEP (mapa/destinos/APIs/imports/consumidores); LAY/API (responsabilidade/regras/contrato/diagnóstico); CMP/STY/FORM/NFR (UI/estado/estilo/aplicáveis); PROC/VAL (permissões/resultados/dispensas); ADR (exceções).

Entrega: resultado/arquivos/decisões/preservação/riscos/legado/validação; próxima etapa só se necessária. Review inclui escopo/dependências/achados, critérios/pontos/evidências, confiança/veredito/plano se negado. Plano termina íntegro; não transcrever guia.

## REV-04 — Severidade

Bloqueador: risco concreto de segurança/perda de dados/impossibilidade de uso. Crítico: contrato ou negócio quebrado sem autorização, regressão comprovada, segredo exposto ou dependência proibida. Maior: responsabilidade misturada, ciclo, acessibilidade relevante ou desvio estrutural. Menor: import/nome, estilo isolado, duplicação pequena ou clareza. Severidade exige impacto demonstrado, não hipótese.

## Resultado obrigatório do review

Liberado: obrigações aplicáveis demonstradas, sem violação ou exceção pendente. Negado: violação aplicável sem autorização. Inconclusivo: evidência decisiva ausente. Exceções autorizadas: registrar escopo, regra e condição de revisão; não anunciar conformidade integral. Severidade ordena correção, mas não dispensa regra. Legado adjacente não alterado não determina sozinho o resultado.

## Confiança e evidência

Não atribuir percentual sem auditoria. Confiança alta exige verificações relevantes; média é parcial; baixa é ausente/insuficiente. Build não comprova interação no navegador. Conformidade estática não comprova função.

# 5. EXCEÇÕES E DECISÕES

## ADR-01 — Exceção explícita

Registrar regra/alternativas, benefício superior ao custo/risco, impacto, escopo e prazo/condição de revisão; obter autorização explícita do desvio. Pedido genérico não é exceção. Não contornar instruções superiores/segurança/permissões; contrato segue INV-02. Exceção não cria precedente, reescreve padrão ou oculta risco.

## ADR-02 — Decisão permanente

Registrar contexto/decisão/alternativas/impactos/compatibilidade-migração/autorização. Mudança permanente de fronteira/regra exige decisão explícita e atualização autorizada das referências, não deriva por preferência. Não ampliar catálogo/documento/configuração fora da tarefa.
# 6. CONTRATO INFANTIL E DECISÕES INICIAIS

- Stack aprovada: React/Vite, MUI e styled-components. JSX usa .jsx, demais módulos .js. MUI mantém seu motor interno Emotion; componentes próprios usam styled-components e tema unificado. Sem substituir o motor por pacote alpha. Sem Next/Tailwind/backend nesta etapa. Todos os diretórios de código canônicos estão sob src/. src/app/ compõe shell/navegação; tests/ abriga testes. Não criar pastas vazias.
- Estilos via styles.js e import * as S; props dinâmicas transitórias $...; sem style/sx estático no JSX. SVG pode declarar atributos de desenho. Tema/global em src/styles/.
- Rodadas contínuas sem limite global de vidas. Banco finito embaralhado, sem repetição imediata quando houver alternativa. Não prometer conteúdo inédito infinito.
- Palavras comuns pt-BR de bosque/animais/frutas/cotidiano; dicas progressivas revisadas. Exibir acentos corretos; entrada aceita equivalência sem acentos via normalização em builder. Letras faltantes esconde todas as ocorrências das letras sorteadas.
- Forca: seis erros por palavra; letra repetida não consome tentativa; acerto revela todas as ocorrências. Resultado oferece outra rodada e mostra a palavra em caso de erro.
- Memória: sempre 16 cartas/8 pares; floresta, mar, brinquedos. Prévia antes de esconder, bloquear terceira escolha durante comparação. Limpar timers ao sair/reiniciar/trocar tema. Quatro colunas também no celular.
- Cores: quatro nomes distintos com uma resposta correta; após acerto oferecer próxima rodada para preservar tempo de observar o efeito. Não revelar resposta no texto visível da pergunta.
- Feedback acolhedor de acerto/erro/conclusão em todos os jogos; respeitar prefers-reduced-motion. Sem anúncios, coleta infantil, login ou integração externa.
- Controles de pelo menos 44px; foco visível, teclado/toque e status acessível. Sem informação dependente apenas da cor.
- Artes originais em SVG/pictogramas podem representar o bosque. Não afirmar fidelidade às ilustrações dos livros sem inspecioná-las. Pintura adiada por pedido explícito.
- Aleatoriedade injetada nos builders para testes determinísticos; regras puras. Sem services, Providers ou camadas vazias.

## Mapa da criação

Regras/contratos de cada jogo → contexts correspondentes, regras.js e builders. Vocabulário → palavras, consumido publicamente por forca. Teclado/timers/feedback local → hooks de página. Layout/teclado/status/dicas realmente reutilizados → components. Aleatoriedade genérica → utils. Shell/navegação → app; tema/global → styles.
