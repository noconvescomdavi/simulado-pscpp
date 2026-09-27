package br.com.estibordo.app;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public final class PrivateSeedImporter {
  private static final String ASSET="private/estibordo-private-seed.json";
  private static final String META_KEY="private_seed_installed";
  private final Context context; private final EstibordoDatabase helper;
  public PrivateSeedImporter(Context context,EstibordoDatabase helper){this.context=context;this.helper=helper;}
  public boolean installIfPresent(){SQLiteDatabase db=helper.getWritableDatabase();if(installed(db))return false;String raw=readAsset();if(raw==null)return false;db.beginTransaction();try{JSONObject root=new JSONObject(raw);if(root.optInt("schema_version",0)!=2)throw new IllegalStateException("seed schema");JSONObject d=root.optJSONObject("data");if(d==null)throw new IllegalStateException("seed data");putSingleton(db,"profile",first(d,"profile"));putSingleton(db,"preferences",first(d,"preferences"));putRows(db,"answers","question_id",d.optJSONArray("answers"),"id");putRows(db,"exam_sessions","id",d.optJSONArray("exams"),"id");putRows(db,"notebooks","id",d.optJSONArray("notebooks"),"id");putRows(db,"mastery","topic_key",d.optJSONArray("mastery"),"topic_code","id");putRows(db,"review_queue","source_key",d.optJSONArray("review_queue"),"id");putRows(db,"study_sessions","id",d.optJSONArray("study_sessions"),"id");putRows(db,"study_plan","item_key",d.optJSONArray("study_plan"),"item_key","task_key","event_key","id");putRows(db,"bibliography","item_key",d.optJSONArray("bibliography"),"item_key","section_key","id");ContentValues m=new ContentValues();m.put("key",META_KEY);m.put("value",root.optString("seed_version","private"));m.put("updated_at",System.currentTimeMillis());db.insertWithOnConflict("meta",null,m,SQLiteDatabase.CONFLICT_REPLACE);db.setTransactionSuccessful();return true;}catch(Exception e){throw new IllegalStateException("Private seed import failed",e);}finally{db.endTransaction();}}
  private boolean installed(SQLiteDatabase db){try(android.database.Cursor c=db.query("meta",new String[]{"key"},"key=?",new String[]{META_KEY},null,null,null,"1")){return c.moveToFirst();}}
  private String readAsset(){try(InputStream in=context.getAssets().open(ASSET);ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1)out.write(b,0,n);return new String(out.toByteArray(),StandardCharsets.UTF_8);}catch(java.io.FileNotFoundException e){return null;}catch(Exception e){throw new IllegalStateException(e);}}
  private JSONObject first(JSONObject d,String key){JSONArray a=d.optJSONArray(key);if(a!=null&&a.length()>0)return a.optJSONObject(0);return d.optJSONObject(key);}
  private void putSingleton(SQLiteDatabase db,String table,JSONObject row){if(row==null)return;ContentValues v=new ContentValues();v.put("id",1);v.put("payload",row.toString());v.put("updated_at",System.currentTimeMillis());db.insertWithOnConflict(table,null,v,SQLiteDatabase.CONFLICT_REPLACE);}
  private void putRows(SQLiteDatabase db,String table,String keyCol,JSONArray rows,String... candidates){if(rows==null)return;for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row==null)continue;String key=value(row,keyCol,candidates);if(key==null||key.isEmpty())continue;ContentValues v=new ContentValues();v.put(keyCol,key);v.put("payload",row.toString());v.put("updated_at",System.currentTimeMillis());db.insertWithOnConflict(table,null,v,SQLiteDatabase.CONFLICT_REPLACE);}}
  private String value(JSONObject row,String first,String... rest){Object v=row.opt(first);if(v!=null&&!JSONObject.NULL.equals(v))return String.valueOf(v);for(String k:rest){v=row.opt(k);if(v!=null&&!JSONObject.NULL.equals(v))return String.valueOf(v);}return null;}
}
