package br.com.estibordo.app;

import android.content.Context;
import androidx.test.core.app.ApplicationProvider;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class LocalHttpServerTest {
  private int status(String url) throws Exception { HttpURLConnection c=(HttpURLConnection)new URL(url).openConnection(); c.setInstanceFollowRedirects(false); c.setConnectTimeout(3000); c.setReadTimeout(3000); int s=c.getResponseCode(); c.disconnect(); return s; }
  @Test public void servesBootAndCoreRoutes() throws Exception {
    Context context=ApplicationProvider.getApplicationContext(); LocalHttpServer server=new LocalHttpServer(context); int port=server.start();
    try { String base="http://127.0.0.1:"+port; assertEquals(200,status(base+"/")); assertEquals(200,status(base+"/area-do-aluno/")); assertEquals(200,status(base+"/simulado/")); assertEquals(200,status(base+"/simulado/simulado-pscpp/")); assertEquals(404,status(base+"/definitely-missing/")); }
    finally { server.stop(); }
  }
}
