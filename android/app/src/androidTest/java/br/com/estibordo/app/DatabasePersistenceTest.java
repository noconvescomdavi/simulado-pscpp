package br.com.estibordo.app;

import android.content.Context;
import androidx.test.core.app.ApplicationProvider;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class DatabasePersistenceTest {
  private Context context;
  @Before public void setup(){context=ApplicationProvider.getApplicationContext();context.deleteDatabase(EstibordoDatabase.NAME);}
  @After public void cleanup(){context.deleteDatabase(EstibordoDatabase.NAME);}
  @Test public void survivesHelperCloseAndReopen(){EstibordoDatabase a=new EstibordoDatabase(context);LocalDataBridge first=new LocalDataBridge(a);first.put("exam_sessions","exam-1","{\\"status\\":\\"paused\\",\\"remaining_seconds\\":321}");first.put("preferences","current","{\\"theme\\":\\"dark\\"}");a.close();EstibordoDatabase b=new EstibordoDatabase(context);LocalDataBridge second=new LocalDataBridge(b);assertTrue(second.get("exam_sessions","exam-1").contains("paused"));assertTrue(second.get("preferences","current").contains("dark"));b.close();}
  @Test public void journalAndUserStateCoexist(){EstibordoDatabase db=new EstibordoDatabase(context);LocalDataBridge bridge=new LocalDataBridge(db);bridge.put("answers","exam-1:q-1","{\\"correct\\":true}");bridge.put("journal","event-1","{\\"type\\":\\"answer\\"}");assertEquals(1,new org.json.JSONArray(bridge.all("answers")).length());assertEquals(1,new org.json.JSONArray(bridge.all("journal")).length());db.close();}
  @Test public void schemaUpgradeKeepsExistingRows(){android.database.sqlite.SQLiteDatabase raw=context.openOrCreateDatabase(EstibordoDatabase.NAME,0,null);raw.execSQL("PRAGMA user_version=1");raw.execSQL("CREATE TABLE profile (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE preferences (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE answers (question_id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE exam_sessions (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE notebooks (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE mastery (topic_key TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE review_queue (source_key TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE study_sessions (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE study_plan (item_key TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE bibliography (item_key TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");raw.execSQL("CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT, updated_at INTEGER NOT NULL)");raw.execSQL("INSERT INTO exam_sessions(id,payload,updated_at) VALUES(?,?,?)",new Object[]{"keep-me","{\\\"status\\\":\\\"paused\\\"}",1});raw.close();EstibordoDatabase upgraded=new EstibordoDatabase(context);LocalDataBridge bridge=new LocalDataBridge(upgraded);assertTrue(bridge.get("exam_sessions","keep-me").contains("paused"));bridge.put("journal","after-upgrade","{\\\"ok\\\":true}");assertNotNull(bridge.get("journal","after-upgrade"));upgraded.close();}
}
