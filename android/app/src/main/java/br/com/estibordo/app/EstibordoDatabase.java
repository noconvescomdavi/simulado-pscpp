package br.com.estibordo.app;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public final class EstibordoDatabase extends SQLiteOpenHelper {
  public static final String NAME="estibordo.db"; public static final int VERSION=1;
  public EstibordoDatabase(Context context){super(context,NAME,null,VERSION);}
  @Override public void onCreate(SQLiteDatabase db){
    db.execSQL("CREATE TABLE profile (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE preferences (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE answers (question_id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE exam_sessions (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE notebooks (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE mastery (topic_key TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE review_queue (source_key TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE study_sessions (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE study_plan (item_key TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE bibliography (item_key TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)");
    db.execSQL("CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT, updated_at INTEGER NOT NULL)");
  }
  @Override public void onUpgrade(SQLiteDatabase db,int oldVersion,int newVersion){}
}
