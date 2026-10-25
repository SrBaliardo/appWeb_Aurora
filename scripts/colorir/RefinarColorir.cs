using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class RefinarColorir {
 static byte[] Ler(Bitmap b) {
  var d=b.LockBits(new Rectangle(0,0,b.Width,b.Height),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
  var p=new byte[d.Stride*b.Height];Marshal.Copy(d.Scan0,p,0,p.Length);b.UnlockBits(d);return p;
 }
 static void Salvar(byte[] p,int w,int h,string path) {
  using(var b=new Bitmap(w,h,PixelFormat.Format32bppArgb)) {
   var d=b.LockBits(new Rectangle(0,0,w,h),ImageLockMode.WriteOnly,PixelFormat.Format32bppArgb);
   Marshal.Copy(p,0,d.Scan0,p.Length);b.UnlockBits(d);b.Save(path,ImageFormat.Png);
  }
 }
 static byte[] Codificar(int[] ids) {
  var p=new byte[ids.Length*4];for(int i=0;i<ids.Length;i++){p[i*4]=(byte)(ids[i]>>16);p[i*4+1]=(byte)(ids[i]>>8);p[i*4+2]=(byte)ids[i];p[i*4+3]=255;}return p;
 }
 static int[] Rotular(bool[] barreira,int w,int h,out List<int> areas) {
  int n=w*h;var ids=new int[n];var fila=new int[n];areas=new List<int>();areas.Add(0);int total=0;
  for(int inicio=0;inicio<n;inicio++) {
   if(barreira[inicio]||ids[inicio]!=0)continue;total++;int a=0,z=1;fila[0]=inicio;ids[inicio]=total;
   while(a<z) {int i=fila[a++],x=i%w;
    if(x>0)Visitar(i-1,total,barreira,ids,fila,ref z);
    if(x<w-1)Visitar(i+1,total,barreira,ids,fila,ref z);
    if(i>=w)Visitar(i-w,total,barreira,ids,fila,ref z);
    if(i<n-w)Visitar(i+w,total,barreira,ids,fila,ref z);
   }
   areas.Add(z);
  }
  return ids;
 }
 static void Visitar(int j,int id,bool[] barreira,int[] ids,int[] fila,ref int z) {if(!barreira[j]&&ids[j]==0){ids[j]=id;fila[z++]=j;}}
 static bool[] Fechar(bool[] original,int w,int h,int raio) {
  int n=w*h;var dil=new bool[n];var fechado=new bool[n];
  for(int y=0;y<h;y++)for(int x=0;x<w;x++) {
   bool valor=false;for(int dy=-raio;dy<=raio&&!valor;dy++)for(int dx=-raio;dx<=raio;dx++) {int xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h&&original[yy*w+xx]){valor=true;break;}}
   dil[y*w+x]=valor;
  }
  for(int y=0;y<h;y++)for(int x=0;x<w;x++) {
   bool valor=true;for(int dy=-raio;dy<=raio&&valor;dy++)for(int dx=-raio;dx<=raio;dx++) {int xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h&&!dil[yy*w+xx]){valor=false;break;}}
   fechado[y*w+x]=valor||original[y*w+x];
  }
  return fechado;
 }
 static void Cortar(bool[] barreira,int w,int h,int[] corte) {
  int x1=corte[0],y1=corte[1],x2=corte[2],y2=corte[3];double raio=corte.Length>4?corte[4]/2.0:1.5;
  int passos=Math.Max(1,Math.Max(Math.Abs(x2-x1),Math.Abs(y2-y1))*2);
  for(int k=0;k<=passos;k++){double cx=x1+(x2-x1)*(double)k/passos,cy=y1+(y2-y1)*(double)k/passos;
   for(int y=Math.Max(0,(int)Math.Floor(cy-raio));y<=Math.Min(h-1,(int)Math.Ceiling(cy+raio));y++)
    for(int x=Math.Max(0,(int)Math.Floor(cx-raio));x<=Math.Min(w-1,(int)Math.Ceiling(cx+raio));x++)if((x-cx)*(x-cx)+(y-cy)*(y-cy)<=raio*raio)barreira[y*w+x]=true;
  }
 }
 public static string Executar(string origem,string destino,string previa,int[][] cortes) {
  const int w=1200,h=800,n=w*h;byte[] p;using(var b=new Bitmap(origem)){if(b.Width!=w||b.Height!=h)throw new Exception("Dimensoes inesperadas");p=Ler(b);}
  var original=new bool[n];for(int i=0;i<n;i++)original[i]=Math.Min(p[i*4],Math.Min(p[i*4+1],p[i*4+2]))<180;
  var barreira=Fechar(original,w,h,3);
  // O fechamento não deve apagar pequenos espaços originalmente fechados, como brilhos dos olhos.
  List<int> areasOriginais;var idsOriginais=Rotular(original,w,h,out areasOriginais);
  for(int i=0;i<n;i++)if(idsOriginais[i]>0&&areasOriginais[idsOriginais[i]]<=120)barreira[i]=false;
  foreach(var corte in cortes)Cortar(barreira,w,h,corte);
  List<int> areas;var ids=Rotular(barreira,w,h,out areas);int removidas=0;
  // Ilhotas mínimas junto a outra área clara são resíduos; brilhos cercados por tinta escura permanecem.
  var troca=new int[areas.Count];for(int id=1;id<areas.Count;id++)troca[id]=id;
  var vizinhos=new Dictionary<int,Dictionary<int,int>>();
  for(int i=0;i<n;i++)if(ids[i]>0&&areas[ids[i]]<=8) {
   int id=ids[i],x=i%w,y=i/w;if(!vizinhos.ContainsKey(id))vizinhos[id]=new Dictionary<int,int>();
   for(int dy=-3;dy<=3;dy++)for(int dx=-3;dx<=3;dx++) {int xx=x+dx,yy=y+dy;if(xx<0||xx>=w||yy<0||yy>=h||Math.Abs(dx)+Math.Abs(dy)>3)continue;
    int outro=ids[yy*w+xx];if(outro>0&&outro!=id&&areas[outro]>=40){if(!vizinhos[id].ContainsKey(outro))vizinhos[id][outro]=0;vizinhos[id][outro]++;}
   }
  }
  foreach(var grupo in vizinhos){int melhor=0,peso=0;foreach(var par in grupo.Value)if(par.Value>peso){melhor=par.Key;peso=par.Value;}if(melhor>0){troca[grupo.Key]=melhor;removidas++;}}
  for(int i=0;i<n;i++)if(ids[i]>0)ids[i]=troca[ids[i]];
  var cobertura=(int[])ids.Clone();var fila=new int[n];int a=0,z=0;
  for(int i=0;i<n;i++)if(cobertura[i]>0)fila[z++]=i;
  while(a<z){int i=fila[a++],x=i%w;
   if(x>0)Expandir(i-1,cobertura[i],cobertura,fila,ref z);
   if(x<w-1)Expandir(i+1,cobertura[i],cobertura,fila,ref z);
   if(i>=w)Expandir(i-w,cobertura[i],cobertura,fila,ref z);
   if(i<n-w)Expandir(i+w,cobertura[i],cobertura,fila,ref z);
  }
  Salvar(Codificar(ids),w,h,destino+"-regioes.png");Salvar(Codificar(cobertura),w,h,destino+"-cobertura.png");
  var cores=new byte[n*4];int clarosBloqueados=0;for(int i=0;i<n;i++) {
   if(ids[i]==0&&p[i*4]>240&&p[i*4+1]>240&&p[i*4+2]>240)clarosBloqueados++;
   uint hash=unchecked((uint)cobertura[i]*2654435761u);for(int c=0;c<3;c++){int cor=80+(int)((hash>>(c*8))%155);cores[i*4+c]=(byte)(p[i*4+c]*cor/255);}cores[i*4+3]=255;
  }
  Salvar(cores,w,h,previa);
  int maior=0;foreach(int area in areas)maior=Math.Max(maior,area);
  return "{\"regioes\":"+(areas.Count-1-removidas)+",\"residuosAgrupados\":"+removidas+",\"cortesRevisados\":"+cortes.Length+",\"pixelsClarosRecuperados\":"+clarosBloqueados+",\"maiorRegiao\":"+maior+"}";
 }
 static void Expandir(int i,int id,int[] cobertura,int[] fila,ref int z){if(cobertura[i]==0){cobertura[i]=id;fila[z++]=i;}}
}
