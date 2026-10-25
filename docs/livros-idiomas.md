# Livros e Goodies por idioma

A interface seleciona a edição em pt-BR, en-US ou es-ES. As edições espanholas fornecidas pelo autor identificam o conteúdo como es-419; esse atributo lang é preservado nos títulos. Não há tradução automática do livro: são usadas as edições completas fornecidas.

## Conteúdo público

- Português mantém os caminhos, PDFs, capas e páginas anteriores.
- Inglês e espanhol: seis capas ilustradas e seis capas Goodies por idioma; 38 páginas de leitura do Bosque por idioma; PDF ilustrado gratuito do Bosque e PDF Goodies gratuito do Bosque por idioma.
- Todos os outros volumes continuam mostrando apenas suas capas. Nenhum PDF ou interior desses volumes é copiado para public.
- Goodies compartilham os mesmos 32 desenhos, miniaturas, máscaras e IDs entre idiomas. Somente capas, títulos e download mudam; IndexedDB e pinturas antigas permanecem compatíveis.

Banners, cards, títulos, indicação do idioma, leitor e downloads acompanham o idioma da interface, independentemente do idioma escolhido para responder aos jogos. A página de colorir permanece montada ao trocar idioma para preservar a pintura em andamento e os títulos personalizados.

## Preparação

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/preparar-traducoes.ps1 -Fontes 'C:\Users\Hunternuma\Documents\books\FINALS'
npm run format
```

O script lê os PDFs sem modificá-los, usa a maior versão numérica de cada pasta Traducoes e confere os Goodies contra o manifesto fornecido. Bosque ilustrado usa v3; os demais usam v2 quando existente, ou v1. Renderização pelo Windows/WinRT e System.Drawing, sem dependências adicionais no aplicativo ou no build do Vercel.

`scripts/traducoes/manifesto.json` registra versões, páginas, hashes e quais volumes foram publicados completos. `contexts/livros/edicoes.js` e `contexts/colorir/edicoes.js` contêm somente os metadados públicos necessários. Os builders compõem os contratos e as fachadas mantêm catálogos estáveis por idioma. O banner Goodies escolhe sua imagem localizada sem importar o motor de pintura na entrada da aplicação.

Os downloads são cópias íntegras dos originais. Capas e páginas são derivados para exibição web. Nenhum desenho ou máscara foi recriado. Fontes editoriais externas permanecem em FINALS e não são necessárias para instalar, testar ou construir o site.

## Validação

`tests/edicoes-livros.test.js` verifica caminhos e arquivos dos três idiomas, hashes dos quatro downloads novos, 38 páginas por edição, exclusividade gratuita do Bosque, títulos/idiomas nos cards e banners e compartilhamento dos IDs e máscaras da pintura. Testes existentes de livros, pintura e interface preservam os contratos anteriores.
