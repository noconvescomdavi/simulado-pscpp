package br.com.estibordo.app;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.webkit.JavascriptInterface;
import org.json.JSONArray;
import org.json.JSONObject;

public final class LocalDataBridge {
  private final EstibordoDatabase helper;
  LocalDataBridge(EstibordoDatabase helper){this.helper=helper;}
  private String table(String name){
    switch(name){case "profile":case "preferences":case "answers":case "exam_sessions":case "notebooks":case "mastery":case "review_queue":case "study_sessions":case "study_plan":case "bibliography":case "meta":return name;default:throw new IllegalArgumentException("store");}
  }
  private String keyColumn(String t){if(t.equals("profile")||t.equals("preferences"))return "id";if(t.equals("answers"))return "question_id";if(t.equals("exam_sessions")||t.equals("notebooks")||t.equals("study_sessions"))return "id";if(t.equals("mastery"))return "topic_key";if(t.equals("review_queue"))return "source_key";if(t.equals("study_plan")||t.equals("bibliography"))return "item_key";return "key";}
  @JavascriptInterface public synchronized String get(String store,String key){String t=table(store),col=keyColumn(t);SQLiteDatabase db=helper.getReadableDatabase();try(Cursor c=db.query(t,new String[]{"payload"},col+"=?",new String[]{key},null,null,null,"1")){return c.moveToFirst()?c.getString(0):null;}catch(Exception e){if(t.equals("meta")){try(Cursor c=db.query(t,new String[]{"value"},col+"=?",new String[]{key},null,null,null,"1")){return c.moveToFirst()?c.getString(0):null;}}throw e;}}
  @JavascriptInterface public synchronized void put(String store,String key,String json){String t=table(store),col=keyColumn(t);SQLiteDatabase db=helper.getWritableDatabase();android.content.ContentValues v=new android.content.ContentValues();if(t.equals("profile")||t.equals("preferences"))v.put(col,1);else v.put(col,key);if(t.equals("meta"))v.put("value",json);else v.put("payload",json);v.put("updated_at",System.currentTimeMillis());db.insertWithOnConflict(t,null,v,SQLiteDatabase.CONFLICT_REPLACE);}
  @JavascriptInterface public synchronized String all(String store){String t=table(store);SQLiteDatabase db=helper.getReadableDatabase();JSONArray a=new JSONArray();String field=t.equals("meta")?"value":"payload";try(Cursor c=db.query(t,new String[]{field},null,null,null,null,"updated_at DESC")){while(c.moveToNext()){String raw=c.getString(0);try{a.put(new JSONObject(raw));}catch(Exception e){a.put(raw);}}}return a.toString();}
  @JavascriptInterface public synchronized void remove(String store,String key){String t=table(store),col=keyColumn(t);helper.getWritableDatabase().delete(t,col+"=?",new String[]{key});}
}
