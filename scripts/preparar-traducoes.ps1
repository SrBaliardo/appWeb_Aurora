param([Parameter(Mandatory=$true)][string]$Fontes)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
Add-Type -AssemblyName System.Drawing
$null=[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null=[Windows.Data.Pdf.PdfDocument,Windows.Data.Pdf,ContentType=WindowsRuntime]
$null=[Windows.Storage.Streams.InMemoryRandomAccessStream,Windows.Storage.Streams,ContentType=WindowsRuntime]
$generico=[System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'} | Select-Object -First 1
$acao=[System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1} | Select-Object -First 1
function Esperar($operacao,$tipo){$t=$generico.MakeGenericMethod($tipo).Invoke($null,@($operacao));$t.GetAwaiter().GetResult()}
function Abrir($caminho){$f=Esperar ([Windows.Storage.StorageFile]::GetFileFromPathAsync($caminho)) ([Windows.Storage.StorageFile]);Esperar ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($f)) ([Windows.Data.Pdf.PdfDocument])}
function Renderizar($documento,$indice,$destino,$largura,$png=$false){
 $pagina=$documento.GetPage($indice);$memoria=New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
 $opcoes=New-Object Windows.Data.Pdf.PdfPageRenderOptions;$opcoes.DestinationWidth=$largura
 $t=$acao.Invoke($null,@($pagina.RenderToStreamAsync($memoria,$opcoes)));$t.GetAwaiter().GetResult() | Out-Null
 $stream=[IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($memoria);$bitmap=[Drawing.Image]::FromStream($stream)
 try{if($png){$bitmap.Save($destino,[Drawing.Imaging.ImageFormat]::Png)}else{
  $codec=[Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
  $parametros=New-Object Drawing.Imaging.EncoderParameters(1)
  $parametros.Param[0]=New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::Quality,[long]90)
  try{$bitmap.Save($destino,$codec,$parametros)}finally{$parametros.Dispose()}
 }}finally{$bitmap.Dispose();$stream.Dispose();$memoria.Dispose();$pagina.Dispose()}
}
$raiz=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$fontesRaiz=(Resolve-Path -LiteralPath $Fontes).Path
function Destino($relativo){$p=[IO.Path]::GetFullPath((Join-Path $raiz $relativo));if(-not $p.StartsWith($raiz+[IO.Path]::DirectorySeparatorChar)){throw 'Destino fora do projeto'};$p}
function Pasta($relativo){$p=Destino $relativo;New-Item -ItemType Directory -Path $p -Force | Out-Null;$p}
$volumes=[ordered]@{bosque='Bosque';amizade='Amizade';misterio='Brilha_Escuro';alfabeto='Alfabeto';comilona='Comilona';estacoes='Quatro_Estacoes'}
$numeros=@{bosque=1;amizade=2;misterio=3;alfabeto=4;comilona=5;estacoes=6}
$idiomas=[ordered]@{'en-US'=@('en','ingles','The-Woods-Are-Calling');'es-ES'=@('es','espanhol','El-Bosque-Nos-Llama')}
$goodiesRaiz=Join-Path $fontesRaiz 'Aurora_Goodies_Traducoes_v1'
$goodiesManifesto=Get-Content -LiteralPath (Join-Path $goodiesRaiz 'producao/manifesto.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$edicoesLivros=[ordered]@{};$edicoesGoodies=[ordered]@{};$manifesto=@()
foreach($idioma in $idiomas.Keys){
 $sigla,$pastaIdioma,$nomeBosque=$idiomas[$idioma]
 $edicoesLivros[$idioma]=[ordered]@{};$edicoesGoodies[$idioma]=[ordered]@{}
 $capas=Pasta "public/books/$idioma/covers";$paginas=Pasta "public/books/$idioma/bosque"
 $capasGoodies=Pasta "public/colorir/$idioma/capas";$downloadsGoodies=Pasta "public/colorir/$idioma/bosque"
 foreach($id in $volumes.Keys){
  $fonteLivro=Join-Path $fontesRaiz ('Traducoes_'+$volumes[$id]+'_v1')
  $meta=Get-Content -LiteralPath (Join-Path $fonteLivro 'producao/metadados.json') -Raw -Encoding UTF8 | ConvertFrom-Json
  $edicao=$meta.$sigla
  $pdf=@(Get-ChildItem -LiteralPath (Join-Path $fonteLivro $pastaIdioma) -File -Filter '*.pdf' | Sort-Object @{Expression={if($_.BaseName -match '_v(\d+)$'){[int]$Matches[1]}else{0}};Descending=$true})[0]
  if(-not $pdf){throw "PDF ausente: $id/$idioma"}
  $hash=(Get-FileHash -LiteralPath $pdf.FullName -Algorithm SHA256).Hash
  $doc=Abrir $pdf.FullName
  Renderizar $doc 0 (Join-Path $capas "$id.jpg") 900
  $dados=[ordered]@{titulo=$edicao.title;idioma=$edicao.lang}
  if($id -eq 'bosque'){
   if($doc.PageCount -ne 38){throw 'Bosque traduzido deve ter 38 paginas'}
   for($i=0;$i -lt $doc.PageCount;$i++){Renderizar $doc $i (Join-Path $paginas ('pagina-{0:000}.jpg' -f ($i+1))) 1800;if($i%8 -eq 0){Write-Output "$idioma leitura: $($i+1)/$($doc.PageCount)"}}
   $arquivo="$nomeBosque.pdf";Copy-Item -LiteralPath $pdf.FullName -Destination (Join-Path $paginas $arquivo)
   if((Get-FileHash -LiteralPath (Join-Path $paginas $arquivo) -Algorithm SHA256).Hash -ne $hash){throw 'PDF copiado diverge'}
   $dados.paginas=$doc.PageCount;$dados.arquivo=$arquivo;$dados.bytes=$pdf.Length;$dados.sha256=$hash.ToLowerInvariant()
  }
  $edicoesLivros[$idioma][$id]=$dados
  $manifesto+= [ordered]@{tipo='livro';id=$id;idioma=$idioma;origem=$pdf.FullName.Substring($fontesRaiz.Length+1);sha256=$hash;paginas=$doc.PageCount;publicadoCompleto=($id -eq 'bosque')}
  if((Get-FileHash -LiteralPath $pdf.FullName -Algorithm SHA256).Hash -ne $hash){throw 'Original alterado'}
  $g=@($goodiesManifesto.livros | Where-Object {$_.livro -eq $numeros[$id] -and $_.idioma -eq $sigla})[0]
  $pdfGoodies=Get-Item -LiteralPath (Join-Path $goodiesRaiz $g.pdf)
  $hashGoodies=(Get-FileHash -LiteralPath $pdfGoodies.FullName -Algorithm SHA256).Hash
  if($hashGoodies.ToLowerInvariant() -ne $g.sha256_pdf){throw 'Goodies diverge do manifesto original'}
  $docGoodies=Abrir $pdfGoodies.FullName;Renderizar $docGoodies 0 (Join-Path $capasGoodies "$id.png") 840 $true
  $dadosGoodies=[ordered]@{titulo=$g.titulo;idioma=$edicao.lang}
  if($id -eq 'bosque'){
   if($docGoodies.PageCount -ne 33){throw 'Goodies do Bosque deve ter 33 paginas'}
   $arquivoGoodies="Aurora-Goodies-$nomeBosque.pdf"
   Copy-Item -LiteralPath $pdfGoodies.FullName -Destination (Join-Path $downloadsGoodies $arquivoGoodies)
   if((Get-FileHash -LiteralPath (Join-Path $downloadsGoodies $arquivoGoodies) -Algorithm SHA256).Hash -ne $hashGoodies){throw 'Goodies copiado diverge'}
   $dadosGoodies.arquivo=$arquivoGoodies;$dadosGoodies.bytes=$pdfGoodies.Length;$dadosGoodies.sha256=$hashGoodies.ToLowerInvariant()
  }
  $edicoesGoodies[$idioma][$id]=$dadosGoodies
  $manifesto+=[ordered]@{tipo='goodies';id=$id;idioma=$idioma;origem=$pdfGoodies.FullName.Substring($fontesRaiz.Length+1);sha256=$hashGoodies;paginas=$docGoodies.PageCount;publicadoCompleto=($id -eq 'bosque')}
  if((Get-FileHash -LiteralPath $pdfGoodies.FullName -Algorithm SHA256).Hash -ne $hashGoodies){throw 'Goodies original alterado'}
  Write-Output "$idioma ${id}: capas prontas"
 }
}
$utf8=New-Object Text.UTF8Encoding($false)
[IO.File]::WriteAllText((Destino 'src/contexts/livros/edicoes.js'),('export const EDICOES = '+($edicoesLivros | ConvertTo-Json -Depth 8)+";`n"),$utf8)
[IO.File]::WriteAllText((Destino 'src/contexts/colorir/edicoes.js'),('export const EDICOES = '+($edicoesGoodies | ConvertTo-Json -Depth 8)+";`n"),$utf8)
$relatorios=Pasta 'scripts/traducoes'
[IO.File]::WriteAllText((Join-Path $relatorios 'manifesto.json'),($manifesto | ConvertTo-Json -Depth 5),$utf8)
Write-Output 'Publicadas 24 capas, 76 paginas de leitura e 4 PDFs gratuitos; originais preservados.'
