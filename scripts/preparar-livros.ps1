Add-Type -AssemblyName System.Runtime.WindowsRuntime
Add-Type -AssemblyName System.Drawing
$null = [Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null = [Windows.Data.Pdf.PdfDocument,Windows.Data.Pdf,ContentType=WindowsRuntime]
$null = [Windows.Storage.Streams.InMemoryRandomAccessStream,Windows.Storage.Streams,ContentType=WindowsRuntime]
$genericTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
$actionTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 } | Select-Object -First 1
function Await-Result($operation, $type) { $task = $genericTask.MakeGenericMethod($type).Invoke($null, @($operation)); $task.GetAwaiter().GetResult() }
function Render-Page($doc, $number, $target, $width) {
  $page = $doc.GetPage($number)
  $memory = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
  $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
  $options.DestinationWidth = $width
  $action = $page.RenderToStreamAsync($memory, $options)
  $task = $actionTask.Invoke($null, @($action)); $task.GetAwaiter().GetResult()
  $stream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($memory)
  $bitmap = [System.Drawing.Image]::FromStream($stream)
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
  $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]90)
  $bitmap.Save($target, $codec, $parameters)
  $bitmap.Dispose(); $stream.Dispose(); $memory.Dispose(); $page.Dispose()
}
$root = (Get-Location).Path
$covers = Join-Path $root 'public/books/covers'
$pages = Join-Path $root 'public/books/bosque'
New-Item -ItemType Directory -Force -Path $covers,$pages | Out-Null
$books = @(
  @('bosque','O_Bosque_Esta_Chamando_ILUSTRADO.pdf'),
  @('estacoes','A_Aventura_das_Quatro_Estacoes_ILUSTRADO.pdf'),
  @('comilona','A_Aventura_da_Comilona_e_o_Tesouro_da_Barriga_Boa_ILUSTRADO.pdf'),
  @('alfabeto','A_Aventura_do_Alfabeto_ILUSTRADO.pdf'),
  @('amizade','A_Grande_Aventura_da_Amizade_ILUSTRADO.pdf'),
  @('misterio','O_Misterio_do_Brilha_Escuro_ILUSTRADO.pdf')
)
$manifest = @()
foreach ($book in $books) {
  $source = Join-Path (Join-Path $root 'materiais-originais') $book[1]
  $hash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
  $file = Await-Result ([Windows.Storage.StorageFile]::GetFileFromPathAsync($source)) ([Windows.Storage.StorageFile])
  $doc = Await-Result ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
  Render-Page $doc 0 (Join-Path $covers ($book[0]+'.jpg')) 900
  if ($book[0] -eq 'bosque') { for ($i=0; $i -lt $doc.PageCount; $i++) { Render-Page $doc $i (Join-Path $pages ('pagina-{0:000}.jpg' -f ($i+1))) 1800 } }
  if ($hash -ne (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash) { throw 'PDF changed' }
  $manifest += @{ id=$book[0]; source=$book[1]; pages=$doc.PageCount; sha256=$hash }
  Write-Output ($book[0] + ': ' + $doc.PageCount + ' pages')
}
$manifest | ConvertTo-Json | Set-Content -Encoding UTF8 'materiais-originais/livros-manifesto.json'
