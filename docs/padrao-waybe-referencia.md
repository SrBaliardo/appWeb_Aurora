# AGENTS.md

## Padrão de Engenharia Frontend — Waybe ERP

**Versão:** 3.4
**Status:** obrigatório em desenvolvimento/manutenção/refatoração/testes/review.
**Escopo:** frontend deste repositório; preferencialmente Codex.

# 1. CONTRATO OBRIGATÓRIO

## GOV-01 — Autoridade, carregamento e interpretação

Ler o documento completo antes de criar/alterar/revisar código. Sistema/desenvolvedor e segurança/permissões do ambiente prevalecem; no projeto: segurança/integridade → pedido explícito autorizado → padrão → legado. Níveis A=invariantes, B=arquitetura, C=processo, D=review; inferior não flexibiliza superior.

Pedido genérico não derroga regras (INV-01/02, ADR). Conflito: informar regra/evidência/impacto, pedir só a decisão necessária; não executar o ponto conflitante.

Confirmar fonte/versão/escopo; reutilizar leitura inalterada. Fonte ausente/inacessível/incompleta: completar leitura ou informar impedimento, sem implementar/presumir conformidade. Sem relaxamento silencioso por override/configuração.

Nome exato AGENTS.md no Git, UTF-8, até 24 KiB (24.576 bytes); descoberta padrão: 32 KiB combinados, sujeitos às fontes/configuração. Não presumir carregamento igual nem elevar limite/editar configuração/criar instrução alternativa automaticamente. Alterar este arquivo só por pedido explícito.

## GOV-02 — Evidência e cumprimento

Conclusão exige evidência em código/configuração/contrato/validação. Hipótese não é fato: apontar lacuna/impacto; ausência no trecho não prova ausência no sistema.

Nota/preferência/consumidores/silêncio/legado/economia não dispensam regras. Corrigir autorizado; registrar/pedir excedente. Não ocultar/inventar achado/aprovação nem oferecer alternativas a destino obrigatório.

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

`contexts/<dominio>/index.js` expõe operações integradas a useApi/React, mesmo sem estado compartilhado ou com uma página. Pode exportar `use<Domínio>()`; Provider só para compartilhamento real na árvore.

Sem Provider não desloca fachada para service/hook local. Fachada consome service sem React; não duplicar operações/intermediários pass-through.

## ARC-03 — Estrutura canônica

```text
pages/<dominio>/<funcionalidade>/
  index.js, styles.js (se houver), components/, hooks/
contexts/<dominio>/
  index.js, regras.js (se houver), builders/
services/<dominio>/index.js (se necessário)
components/, hooks/, utils/, styles/ (compartilhados)
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
| Estado/efeito/interação de página | pages/.../hooks/ ou composição local simples |
| Apresentação/estilo | componente e styles.js |
| Função pura sem domínio | utils/ |

Específicos ficam na funcionalidade; compartilhados na pasta correspondente. Não contornar a tabela movendo contrato/regra/operação para JSX/página/service/util. Não criar service de negócio solto na raiz; preservar infraestrutura transversal existente; novo transversal usa `services/<capacidade>/` com finalidade explícita.

Atendimentos/consulta rápida compartilham fachada só pela mesma responsabilidade. Contratos distintos têm operações/builders próprios; filtros/paginação/interação nos hooks locais. Taxas segue a mesma regra.

## ARC-07 — Catálogo e decisão de domínio

| Responsabilidade | Domínio / fachada pública |
|---|---|
| Cadastro/edição/listagem/exclusão e convênios/taxas de bandeiras | bandeirasCartao / contexts/bandeirasCartao/index.js |
| Relatório monetário de taxas de serviço por vendedor e auxiliares | taxasServico / contexts/taxasServico/index.js |
| Cadastro/edição/listagem de categorias de sangria, fornecedor auxiliar e rateios; exclui movimentações de sangria | categoriasSangria / contexts/categoriasSangria/index.js |

Catálogo inicial, não auditoria geral. financas na rota não substitui fronteira; API/auth/loader/tema são infraestrutura.

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

Antes de criar: equivalente/composição/prop retrocompatível, consumidores/contrato genérico. Sem duplicação injustificada ou negócio específico em shared; exceções crescentes: base + composição/hooks; adapter requer ARC-05.

Estados normal/loading/vazio/erro/desabilitado, responsividade/teclado/foco aplicáveis. Props seguem INV-02; sem modernizar shared fora do escopo.

## STY-01 — Estilos

Emotion/MUI, styles.js local e `import * as S from './styles';`. Preferir composição/extensão; sem estilo de outra página, CSS duplicado por conveniência ou Tailwind/estratégia paralela não autorizada.

Sem style estático no JSX. Dinâmico só por exigência de API, runtime não representável por prop/CSS variable ou performance demonstrada. Filtrar props/usar CSS properties sem props inválidas no DOM.

Na refatoração autorizada, extrair inline estático para styles.js local (reutilizar/criar componentes estilizados); atualizar JSX/imports preservando aparência/comportamento. Fora do escopo ou em análise/review: só registrar. Inline dinâmico segue as exceções acima.

## FORM-01 — Formulário e estado

Priorizar React Hook Form e Yup com schema compatível, sem mudar regras/mensagens. Não duplicar valor do formulário em useState; derivar calculáveis, centralizar validação fora do JSX e distinguir servidor/formulário/visual. Não globalizar dado de uma página. Mudança de validação requer autorização funcional.

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

Em implementação autorizada, sem confirmação adicional salvo dispensa:

- ESLint existente, só arquivos criados/alterados.
- --fix mecânico nos mesmos arquivos: diagnóstico prévio, padrão --fix-type layout.
- git diff --check nos caminhos da tarefa, incluindo novos.
- Repetição após ajustes, sem repetir falha sem correção/nova evidência.

Outros tipos de fix exigem diagnóstico de mecânica/preservação. Revisar diff/repetir lint. Sem fix funcional/incerto, legado adjacente, sobrescrita, regra desativada ou falha mascarada. Se não limitar com segurança, corrigir só necessário ou pedir excedente. Fix não autoriza formatter separado.

Análise/review: comandos por pedido explícito; fix requer implementação. Documento não exige ESLint. Ferramenta ausente/incompatível: registrar, sem instalação/configuração automática. Permissão técnica do ambiente continua necessária.

Criar/alterar/executar testes (inclusive A), typecheck/sintaxe separados, formatter/build/Storybook/bundle/E2E exige autorização da classe/comando/escopo. Implícitos não abrangem varredura geral/dependências/configuração.

Informar realizados; adicionais úteis em pergunta única: mínima=restante A; recomendada=A+B; ampla=A+B+C; encerrar=sem adicional. Só itens aplicáveis, sem reautorizar.

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

| Severidade | Impacto demonstrado |
|---|---|
| Bloqueador | Risco concreto de segurança/perda de dados/indisponibilidade/impossibilidade de uso. |
| Crítico | Contrato/endpoint/método/auth/permissão/navegação/validação/negócio quebrado sem autorização; alteração funcional escondida; consumidor público quebrado; segredo exposto; estrutura fora do escopo; dependência proibida entre domínios em novo/refatorado; regressão comprovada. |
| Maior | HTTP/contrato em página; shared depende de página; ciclo/duplicação relevante; responsabilidade misturada; erro/loading ausente; acessibilidade relevante violada; desvio estrutural prejudicial; camada/estilos/infra não autorizados sem impacto crítico. |
| Menor | Import/nome, estilo estático isolado, localização sem acoplamento relevante, duplicação pequena, clareza sem risco funcional. |

Maior nível sustentado por impacto, não hipótese. Severidade ordena correção; violação menor também bloqueia.

## Resultado obrigatório — gate independente da nota

- **Review Liberado — Código Dentro dos Padrões:** obrigações aplicáveis demonstradas, sem violação/exceção pendente. Validação dispensada não é obrigatória; confiança é separada.
- **Review Negado — Código Fora dos Padrões:** qualquer violação aplicável sem exceção explícita vigente, de qualquer severidade. Nota/prazo/esforço/testes não compensam.
- **Review Inconclusivo:** evidência decisiva insuficiente, sem violação já demonstrada que determine negação. Listar falta e menor ação útil; testes dispensados não bastam para bloquear.
- **Review com Exceções Autorizadas — Conformidade Não Integral:** sem violação não autorizada/pendência decisiva, mas desvio vigente aceito por ADR-01. Registrar regra/autorização/impacto/prazo; não anunciar cumprimento integral.

Legado adjacente não muda automaticamente gate; risco externo impeditivo segue INV-04/06. Exceção válida não volta como pendência no mesmo escopo; validade perdida/risco novo exige revisão.

## Pontuação informativa e confiança

| Categoria / critérios | Peso |
|---|---:|
| Arquitetura: ARC-01 a ARC-07 + DEP-01 a DEP-03 | 25% |
| Responsabilidades/contratos: LAY-01 a LAY-07 + INV-02 + API-01/02 | 20% |
| Integridade: INV-01 + INV-03 a INV-06 | 20% |
| Manutenção: CMP-01 + STY-01 + FORM-01 + duplicação/clareza | 15% |
| Testabilidade: isolamento e ausência de dependências ocultas | 10% |
| Não funcionais: NFR-01 a NFR-05 | 10% |

Um critério por ID, não bullet: conforme=1; parcial=0,5; não conforme=0; não aplicável sai do denominador; pendente não ganha aprovação. Problema conta só no critério principal, impactos secundários registrados. Duplicação/clareza é um critério; execução de testes não entra na nota.

Categoria=pontos/critério aplicável. Final=100 × soma(peso × categoria)/soma(pesos aplicáveis); excluir categorias inteiramente não aplicáveis. Registrar pontos/aplicabilidade/evidências; arredondar só apresentação. Sem critério aplicável ou com pendência decisiva, não inventar percentual; aplicar gate. Nem 100% substitui obrigações/evidência/autorização.

Confiança: alta=validações relevantes aprovadas; média=parcial/localizada; baixa=ausente/indisponível/insuficiente. Explicitar lacunas: mock não comprova backend; local não comprova jornada. Conformidade estática não comprova função.

# 5. EXCEÇÕES E DECISÕES

## ADR-01 — Exceção explícita

Registrar regra/alternativas, benefício superior ao custo/risco, impacto, escopo e prazo/condição de revisão; obter autorização explícita do desvio. Pedido genérico não é exceção. Não contornar instruções superiores/segurança/permissões; contrato segue INV-02. Exceção não cria precedente, reescreve padrão ou oculta risco.

## ADR-02 — Decisão permanente

Registrar contexto/decisão/alternativas/impactos/compatibilidade-migração/autorização. Mudança permanente de fronteira/regra exige decisão explícita e atualização autorizada das referências, não deriva por preferência. Não ampliar catálogo/documento/configuração fora da tarefa.