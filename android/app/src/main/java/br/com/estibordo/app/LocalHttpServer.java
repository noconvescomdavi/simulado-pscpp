package br.com.estibordo.app;

import android.content.Context;
import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;

public final class LocalHttpServer {
  private final Context context; private final ExecutorService pool=Executors.newCachedThreadPool(); private ServerSocket server; private int port;
  public LocalHttpServer(Context context){this.context=context.getApplicationContext();}
  public int start() throws IOException {server=new ServerSocket();server.bind(new InetSocketAddress(InetAddress.getByName("127.0.0.1"),0));port=server.getLocalPort();pool.execute(this::loop);return port;}
  public void stop(){try{if(server!=null)server.close();}catch(Exception ignored){}pool.shutdownNow();}
  private void loop(){while(server!=null&&!server.isClosed()){try{Socket s=server.accept();pool.execute(()->serve(s));}catch(Exception e){if(server!=null&&!server.isClosed())e.printStackTrace();}}}
  private void serve(Socket socket){try(socket){BufferedReader r=new BufferedReader(new InputStreamReader(socket.getInputStream()));String line=r.readLine();if(line==null)return;String[] parts=line.split(" ");String raw=parts.length>1?parts[1]:"/";while((line=r.readLine())!=null&&!line.isEmpty()){}String path=URLDecoder.decode(raw.split("\\?",2)[0],"UTF-8");if(path.startsWith("/"))path=path.substring(1);if(path.isEmpty())path="area-do-aluno/index.html";InputStream in=open(path);if(in==null&&!path.contains("."))in=open(path+"/index.html");if(in==null){write(socket,"404 Not Found","text/plain",new ByteArrayInputStream("Not found".getBytes()));return;}write(socket,"200 OK",mime(path),in);}catch(Exception ignored){}}
  private InputStream open(String path){try{return context.getAssets().open("www/"+path);}catch(Exception e){return null;}}
  private void write(Socket s,String status,String mime,InputStream in)throws IOException{OutputStream o=s.getOutputStream();o.write(("HTTP/1.1 "+status+"\r\nContent-Type: "+mime+"\r\nCache-Control: no-cache\r\nConnection: close\r\n\r\n").getBytes("UTF-8"));byte[] b=new byte[16384];for(int n;(n=in.read(b))!=-1;)o.write(b,0,n);in.close();o.flush();}
  private String mime(String p){String x=p.toLowerCase(Locale.ROOT);if(x.endsWith(".html")||!x.contains("."))return "text/html; charset=utf-8";if(x.endsWith(".js")||x.endsWith(".mjs"))return "application/javascript; charset=utf-8";if(x.endsWith(".css"))return "text/css; charset=utf-8";if(x.endsWith(".json"))return "application/json; charset=utf-8";if(x.endsWith(".svg"))return "image/svg+xml";if(x.endsWith(".png"))return "image/png";if(x.endsWith(".jpg")||x.endsWith(".jpeg"))return "image/jpeg";if(x.endsWith(".webp"))return "image/webp";if(x.endsWith(".woff2"))return "font/woff2";return "application/octet-stream";}
}
