# Derivados de navegação e máscaras; nunca sobrescreve materiais-originais/livrosColorir.
# Executar na raiz: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/preparar-colorir.ps1
# -Piloto gera somente páginas 1, 16 e 32 em .tmp, sem publicar.
param([switch]$Piloto)
$ErrorActionPreference='Stop'
$Todas=-not $Piloto
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class PrepararColorir {
 static byte[] Pixels(Bitmap b) { var d=b.LockBits(new Rectangle(0,0,b.Width,b.Height),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb); var p=new byte[d.Stride*b.Height]; Marshal.Copy(d.Scan0,p,0,p.Length); b.UnlockBits(d); return p; }
 static void Salvar(byte[] p,int w,int h,string path) { using(var b=new Bitmap(w,h,PixelFormat.Format32bppArgb)) { var d=b.LockBits(new Rectangle(0,0,w,h),ImageLockMode.WriteOnly,PixelFormat.Format32bppArgb); Marshal.Copy(p,0,d.Scan0,p.Length); b.UnlockBits(d); b.Save(path,ImageFormat.Png); } }
 public static string Executar(string origem,string destino,bool previa) {
  int w=1200,h=800,n=w*h;
  byte[] p;
  using(var src=new Bitmap(origem)) using(var b=new Bitmap(w,h,PixelFormat.Format32bppArgb)) { using(var g=Graphics.FromImage(b)){g.Clear(Color.White);g.InterpolationMode=System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;g.DrawImage(src,0,0,w,h);} p=Pixels(b); b.Save(destino+".png",ImageFormat.Png); using(var thumb=new Bitmap(b,240,160)){thumb.Save(destino+"-mini.png",ImageFormat.Png);} }
  var bloqueio=new bool[n];var dilatado=new bool[n];var fechado=new bool[n];
  for(int i=0;i<n;i++)bloqueio[i]=Math.Min(p[i*4],Math.Min(p[i*4+1],p[i*4+2]))<180;
  for(int y=0;y<h;y++)for(int x=0;x<w;x++){bool v=false;for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++){int xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h&&bloqueio[yy*w+xx])v=true;}dilatado[y*w+x]=v;}
  for(int y=0;y<h;y++)for(int x=0;x<w;x++){bool v=true;for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++){int xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h&&!dilatado[yy*w+xx])v=false;}fechado[y*w+x]=v;}
  int[] ids=new int[n],fila=new int[n];int total=0,maior=0;
  for(int start=0;start<n;start++){if(fechado[start]||ids[start]!=0)continue;total++;int a=0,z=1;fila[0]=start;ids[start]=total;while(a<z){int i=fila[a++],x=i%w;int[] viz={x>0?i-1:-1,x<w-1?i+1:-1,i>=w?i-w:-1,i<n-w?i+w:-1};foreach(int j in viz)if(j>=0&&!fechado[j]&&ids[j]==0){ids[j]=total;fila[z++]=j;}}maior=Math.Max(maior,z);}
  byte[] mapa=new byte[n*4],cores=previa?new byte[n*4]:null;
  for(int i=0;i<n;i++){int id=ids[i];mapa[4*i]=(byte)(id>>16);mapa[4*i+1]=(byte)(id>>8);mapa[4*i+2]=(byte)id;mapa[4*i+3]=255;if(previa){for(int c=0;c<3;c++){int cor=id==0?255:100+(int)(((long)id*(c==0?73:c==1?131:193))%145);cores[4*i+c]=(byte)(p[4*i+c]*cor/255);}cores[4*i+3]=255;}}
  Salvar(mapa,w,h,destino+"-regioes.png");if(previa)Salvar(cores,w,h,destino+"-conferencia.png");
  return "{\"regioes\":"+total+",\"maiorRegiaoPixels\":"+maior+",\"largura\":"+w+",\"altura\":"+h+"}";
 }
}
'@
$destino=Join-Path (Get-Location) '.tmp/colorir-piloto'
New-Item -ItemType Directory -Path $destino -Force | Out-Null
$numeros=if($Todas){1..32}else{1,16,32}
foreach($numero in $numeros){$nome='pagina-{0:d2}' -f $numero;$origem=Join-Path (Get-Location) ('materiais-originais/livrosColorir/Livro_Colorir_Bosque_v1/imagens/pagina_{0:d2}.png' -f $numero);$dados=[PrepararColorir]::Executar($origem,(Join-Path $destino $nome),$true);Write-Output "$nome $dados"}

if(-not $Piloto){
Add-Type -AssemblyName System.Drawing
$raiz=(Get-Location).Path
$destino=Join-Path $raiz 'public/colorir'
New-Item -ItemType Directory -Path "$destino/bosque","$destino/capas" -Force | Out-Null
Get-ChildItem -LiteralPath "$raiz/.tmp/colorir-piloto" -Filter '*.png' | Where-Object Name -notlike '*conferencia*' | Copy-Item -Destination "$destino/bosque"
$pastas=@{bosque='Bosque';amizade='Amizade';misterio='Brilha_Escuro';alfabeto='Alfabeto';comilona='Comilona';estacoes='Quatro_Estacoes'}
foreach($id in $pastas.Keys){
 $pasta=Join-Path $raiz ('materiais-originais/livrosColorir/Livro_Colorir_'+$pastas[$id]+'_v1')
 $imagem=[Drawing.Bitmap]::FromFile("$pasta/producao/qa/pagina-01.png")
 $mini=New-Object Drawing.Bitmap(840,594)
 $g=[Drawing.Graphics]::FromImage($mini);$g.Clear([Drawing.Color]::White);$g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
 $g.DrawImage($imagem,0,0,840,594);$mini.Save("$destino/capas/$id.png",[Drawing.Imaging.ImageFormat]::Png)
 $g.Dispose();$mini.Dispose();$imagem.Dispose()
}
$pdf=Get-ChildItem -LiteralPath "$raiz/materiais-originais/livrosColorir/Livro_Colorir_Bosque_v1" -Filter '*.pdf'
Copy-Item -LiteralPath $pdf.FullName -Destination "$destino/bosque/Aurora-Goodies-Bosque.pdf"
$hashOriginal=(Get-FileHash -LiteralPath $pdf.FullName -Algorithm SHA256).Hash
$hashCopia=(Get-FileHash -LiteralPath "$destino/bosque/Aurora-Goodies-Bosque.pdf" -Algorithm SHA256).Hash
if($hashOriginal -ne $hashCopia){throw 'Falha na integridade do PDF'}
foreach($inicio in @(1,17)){
 $sheet=New-Object Drawing.Bitmap(1200,864);$g=[Drawing.Graphics]::FromImage($sheet);$g.Clear([Drawing.Color]::White)
 $font=New-Object Drawing.Font('Arial',11)
 for($i=0;$i -lt 16;$i++){$n=$inicio+$i;$arquivo=Join-Path $raiz ('.tmp/colorir-piloto/pagina-{0:d2}-conferencia.png' -f $n);$img=[Drawing.Bitmap]::FromFile($arquivo);$x=($i%4)*300;$y=[math]::Floor($i/4)*216;$g.DrawImage($img,[int]$x,[int]$y,300,200);$g.DrawString([string]$n,$font,[Drawing.Brushes]::Black,[single]($x+5),[single]($y+200));$img.Dispose()}
 $sheet.Save((Join-Path $raiz ".tmp/colorir-piloto/prancha-$inicio.png"),[Drawing.Imaging.ImageFormat]::Png);$font.Dispose();$g.Dispose();$sheet.Dispose()
}
Get-ChildItem -LiteralPath $destino -Recurse -File | Measure-Object Length -Sum | Select-Object Count,@{N='MB';E={[math]::Round($_.Sum/1MB,1)}} | ConvertTo-Json
Write-Output "SHA256 PDF $hashCopia"

}
} finally { Pop-Location }
