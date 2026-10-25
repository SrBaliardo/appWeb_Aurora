# Visual inspirado nos livros

## Ponto de retorno

Backup anterior à alteração: `backups/aurora-antes-visual-livros-20261022-230503.zip`.
Manifesto e SHA-256: arquivo JSON de mesmo nome. Instruções em `backups/COMO-RESTAURAR.md`.
O ZIP contém 72 arquivos e foi verificado por CRC. Inclui os seis PDFs e o build anterior; exclui node_modules, caches, temporários, Git e backups.

## Imagem inicial

`public/images/aurora-turma-bosque.jpg` é a própria ilustração embutida em `materiais-originais/O_Bosque_Esta_Chamando_ILUSTRADO.pdf`, extraída sem alterar seus pixels ou o PDF. Dimensões: 1536×1024. Não foi gerada uma nova interpretação dos personagens.

A arte mostra Aurora de cabelo loiro e vestido lilás, a capivara com mochila verde e os amigos no bosque. A composição completa é exibida na página inicial sem cortar personagens, com proporção reservada para evitar mudança de layout durante o carregamento.

## Estilos

- Verde de folhagem, amarelo de sol, lilás, azul de céu e laranja mais vivos, em superfícies claras.
- Símbolo da folha, composição do logo e textos da interface preservados.
- Memória: cores explícitas também quando o botão está desabilitado; frente clara com borda amarela, pares encontrados com verde vivo e marca de acerto.
- A virada pertence ao interior da carta; o brilho do par anima apenas a sombra e o pequeno salto anima apenas a figura. Assim o efeito de descoberta não substitui a rotação da frente.
- Movimento reduzido continua respeitado. Não foram modificados regras, temas, tempo de prévia, contagem de jogadas ou fluxo de nenhum jogo.

## Validação

Lint e build de produção; comparação dos hashes das regras, hook de memória, ícone, favicon e AGENTS com o backup; comparação dos textos e logo. A arte extraída foi inspecionada visualmente.

O navegador conectado e o canal nativo de controle do computador não estavam disponíveis nesta sessão. Portanto, a interface no navegador ainda precisa de conferência visual; build e inspeção de código não substituem essa etapa.
