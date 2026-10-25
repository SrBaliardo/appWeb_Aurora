# Novas máscaras v2, sem modificar a arte nem os mapas v1 usados pelos progressos antigos.
param([switch]$Publicar,[int[]]$Paginas=(1..32))
$ErrorActionPreference='Stop'
if($Publicar -and (($Paginas | Sort-Object -Unique).Count -ne 32 -or ($Paginas | Where-Object {$_ -lt 1 -or $_ -gt 32}))){throw 'Publicação exige as 32 páginas; use subconjuntos somente para conferência.'}
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
 Add-Type -AssemblyName System.Drawing
 Add-Type -ReferencedAssemblies System.Drawing -Path "$PSScriptRoot/colorir/RefinarColorir.cs"
 $saida=Join-Path (Get-Location) '.tmp/colorir-v2'
 New-Item -ItemType Directory -Path $saida -Force | Out-Null
 $fechamentos=Get-Content "$PSScriptRoot/colorir/fechamentos.json" -Raw -Encoding UTF8 | ConvertFrom-Json
 $relatorio=@()
 foreach($n in $Paginas) {
  $nome='pagina-{0:d2}' -f $n
  $cortes=@();$entrada=$fechamentos.PSObject.Properties[$nome]
  if($entrada){foreach($corte in $entrada.Value){$cortes+= ,([int[]]$corte)}}
  $origem=Join-Path (Get-Location) "public/colorir/bosque/$nome.png"
  $antigo=Join-Path (Get-Location) "public/colorir/bosque/$nome-regioes.png"
  $hashArte=(Get-FileHash -LiteralPath $origem -Algorithm SHA256).Hash
  $hashLegado=(Get-FileHash -LiteralPath $antigo -Algorithm SHA256).Hash
  $resultado=[RefinarColorir]::Executar($origem,"$saida/$nome-v2","$saida/$nome-conferencia.png",[int[][]]$cortes) | ConvertFrom-Json
  if($hashArte -ne (Get-FileHash -LiteralPath $origem -Algorithm SHA256).Hash -or $hashLegado -ne (Get-FileHash -LiteralPath $antigo -Algorithm SHA256).Hash){throw "Fonte alterada: $nome"}
  $relatorio+= [pscustomobject]@{pagina=$n;arteSHA256=$hashArte;legadoSHA256=$hashLegado;dados=$resultado}
 }
 $relatorio | ConvertTo-Json -Depth 5 | Set-Content "$saida/relatorio.json" -Encoding UTF8
 foreach($inicio in @(1,9,17,25)) {
  $sheet=New-Object Drawing.Bitmap(1200,1664);$g=[Drawing.Graphics]::FromImage($sheet);$g.Clear([Drawing.Color]::White);$font=New-Object Drawing.Font('Arial',16)
  for($i=0;$i -lt 8;$i++) {
   $n=$inicio+$i;$nome='pagina-{0:d2}' -f $n;$img=[Drawing.Bitmap]::FromFile("$saida/$nome-conferencia.png")
   $x=($i%2)*600;$y=[math]::Floor($i/2)*416;$g.DrawImage($img,[int]$x,[int]$y,600,400);$g.DrawString([string]$n,$font,[Drawing.Brushes]::Black,[single]($x+4),[single]($y+396));$img.Dispose()
  }
  $sheet.Save("$saida/prancha-$inicio.png",[Drawing.Imaging.ImageFormat]::Png);$g.Dispose();$font.Dispose();$sheet.Dispose()
 }
 if($Publicar){Get-ChildItem -LiteralPath $saida -Filter '*-v2-*.png' | Copy-Item -Destination 'public/colorir/bosque'; Copy-Item -LiteralPath "$saida/relatorio.json" -Destination 'scripts/colorir/relatorio-v2.json'}
 $relatorio | ConvertTo-Json -Depth 5 -Compress
} finally { Pop-Location }
