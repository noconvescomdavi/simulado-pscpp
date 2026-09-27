package br.com.estibordo.app;

import android.webkit.WebView;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class MainActivityRenderTest {
  @Test public void dashboardRendersVisibleDom() throws Exception {
    AtomicReference<String> result=new AtomicReference<>(""); CountDownLatch latch=new CountDownLatch(1);
    try(ActivityScenario<MainActivity> scenario=ActivityScenario.launch(MainActivity.class)){
      Thread.sleep(5000);
      scenario.onActivity(activity->{WebView web=activity.findViewById(br.com.estibordo.app.R.id.estibordo_webview); if(web==null){result.set("missing-webview");latch.countDown();return;} web.evaluateJavascript("JSON.stringify({text:(document.body&&document.body.innerText||'').trim().length,html:(document.body&&document.body.innerHTML||'').length,path:location.pathname})",v->{result.set(v);latch.countDown();});});
      assertTrue("WebView evaluation timed out",latch.await(10,TimeUnit.SECONDS)); String value=result.get(); assertNotNull(value); assertFalse(value.contains("missing-webview")); assertFalse("Dashboard body is empty: "+value,value.contains("\\\"text\\\":0")); assertTrue("Wrong boot route: "+value,value.contains("area-do-aluno"));
    }
  }
}
