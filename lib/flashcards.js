import { flashQuery, withFlashTransaction } from "./flashcards-db";

function number(value) {
  return Number(value || 0);
}

function accuracy(correct, answered) {
  return answered > 0 ? Math.round((correct / answered) * 100) : 0;
}

function normalizeDeck(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    subject_slug: row.subject_slug,
    subject_label: row.subject_label,
    title: row.title,
    description: row.description || "",
    cards: Array.isArray(row.cards) ? row.cards : [],
    card_count: number(row.card_count ?? (Array.isArray(row.cards) ? row.cards.length : 0)),
    is_active: row.is_active === true,
    sort_order: number(row.sort_order),
  };
}

export async function getFlashcardDeck(slug) {
  const result = await flashQuery(
    `select id,slug,subject_slug,subject_label,title,description,cards,is_active,sort_order,
            jsonb_array_length(cards) as card_count
       from decks
      where slug=$1 and is_active=true
      limit 1`,
    [String(slug || "").trim().toLowerCase()]
  );

  return normalizeDeck(result.rows[0] || null);
}

export async function listFlashcardDecks(userId) {
  const result = await flashQuery(
    `select d.id,d.slug,d.subject_slug,d.subject_label,d.title,d.description,d.is_active,d.sort_order,
            jsonb_array_length(d.cards) as card_count,
            coalesce(m.answered,0)::int as answered,
            coalesce(m.correct,0)::int as correct,
            coalesce(m.wrong,0)::int as wrong,
            coalesce(p.difficult,0)::int as difficult,
            coalesce(p.studied_cards,0)::int as studied_cards
       from decks d
       left join lateral (
         select count(*) as answered,
                count(*) filter(where a.is_correct) as correct,
                count(*) filter(where not a.is_correct) as wrong
           from answer_events a
          where a.user_id=$1 and a.deck_id=d.id
       ) m on true
       left join lateral (
         select count(*) filter(where cp.difficult) as difficult,
                count(*) filter(where cp.last_seen_at is not null) as studied_cards
           from card_progress cp
          where cp.user_id=$1 and cp.deck_id=d.id
       ) p on true
      where d.is_active=true
      order by d.sort_order,d.subject_label,d.title`,
    [userId]
  );

  return result.rows.map((row) => {
    const answered = number(row.answered);
    const correct = number(row.correct);
    return {
      ...normalizeDeck(row),
      metrics: {
        answered,
        correct,
        wrong: number(row.wrong),
        difficult: number(row.difficult),
        studied_cards: number(row.studied_cards),
        accuracy: accuracy(correct, answered),
      },
    };
  });
}

export async function getFlashcardState(userId, deckId) {
  const [totals, progress] = await Promise.all([
    flashQuery(
      `select count(*)::int as answered,
              count(*) filter(where is_correct)::int as correct,
              count(*) filter(where not is_correct)::int as wrong,
              count(distinct card_key)::int as studied_cards
         from answer_events
        where user_id=$1 and deck_id=$2`,
      [userId, deckId]
    ),
    flashQuery(
      `select card_key,correct_count,wrong_count,difficult,last_answer_correct,last_seen_at
         from card_progress
        where user_id=$1 and deck_id=$2`,
      [userId, deckId]
    ),
  ]);

  const row = totals.rows[0] || {};
  const answered = number(row.answered);
  const correct = number(row.correct);
  const difficult = progress.rows.filter((item) => item.difficult === true).length;

  return {
    metrics: {
      answered,
      correct,
      wrong: number(row.wrong),
      difficult,
      studied_cards: number(row.studied_cards),
      accuracy: accuracy(correct, answered),
    },
    progress: progress.rows.map((item) => ({
      card_key: item.card_key,
      correct_count: number(item.correct_count),
      wrong_count: number(item.wrong_count),
      difficult: item.difficult === true,
      last_answer_correct:
        typeof item.last_answer_correct === "boolean" ? item.last_answer_correct : null,
      last_seen_at: item.last_seen_at ? new Date(item.last_seen_at).toISOString() : null,
    })),
  };
}

export async function startFlashcardSession(userId, deckId, mode) {
  const safeMode = mode === "exam" ? "exam" : "study";
  const result = await flashQuery(
    `insert into study_sessions(user_id,deck_id,mode)
     values($1,$2,$3)
     returning id,mode,started_at`,
    [userId, deckId, safeMode]
  );
  return result.rows[0];
}

export async function finishFlashcardSession(userId, deckId, sessionId, status = "completed") {
  if (!sessionId) return null;
  const safeStatus = status === "abandoned" ? "abandoned" : "completed";
  const result = await flashQuery(
    `update study_sessions
        set status=$4,finished_at=coalesce(finished_at,now()),last_activity_at=now()
      where id=$3 and user_id=$1 and deck_id=$2 and status='in_progress'
      returning id,status,finished_at`,
    [userId, deckId, sessionId, safeStatus]
  );
  return result.rows[0] || null;
}

export async function recordFlashcardAnswer({
  userId,
  deckId,
  cardKey,
  correct,
  responseTimeMs,
  sessionId,
}) {
  return withFlashTransaction(async (client) => {
    const response =
      Number.isFinite(Number(responseTimeMs)) && Number(responseTimeMs) >= 0
        ? Math.min(Number(responseTimeMs), 60 * 60 * 1000)
        : null;

    await client.query(
      `insert into answer_events(session_id,user_id,deck_id,card_key,is_correct,response_time_ms)
       values($1,$2,$3,$4,$5,$6)`,
      [sessionId || null, userId, deckId, cardKey, correct === true, response]
    );

    await client.query(
      `insert into card_progress(
         user_id,deck_id,card_key,correct_count,wrong_count,last_answer_correct,last_seen_at,updated_at
       )
       values($1,$2,$3,$4,$5,$6,now(),now())
       on conflict(user_id,deck_id,card_key) do update set
         correct_count=card_progress.correct_count + excluded.correct_count,
         wrong_count=card_progress.wrong_count + excluded.wrong_count,
         last_answer_correct=excluded.last_answer_correct,
         last_seen_at=now(),
         updated_at=now()`,
      [userId, deckId, cardKey, correct ? 1 : 0, correct ? 0 : 1, correct === true]
    );

    if (sessionId) {
      await client.query(
        `update study_sessions
            set answered_count=answered_count+1,
                correct_count=correct_count+$4,
                wrong_count=wrong_count+$5,
                last_activity_at=now()
          where id=$3 and user_id=$1 and deck_id=$2 and status='in_progress'`,
        [userId, deckId, sessionId, correct ? 1 : 0, correct ? 0 : 1]
      );
    }

    return true;
  });
}

export async function setFlashcardDifficult(userId, deckId, cardKey, difficult) {
  const result = await flashQuery(
    `insert into card_progress(user_id,deck_id,card_key,difficult,updated_at)
     values($1,$2,$3,$4,now())
     on conflict(user_id,deck_id,card_key) do update set
       difficult=excluded.difficult,
       updated_at=now()
     returning card_key,difficult`,
    [userId, deckId, cardKey, difficult === true]
  );
  return result.rows[0];
}

export async function resetFlashcardDeckProgress(userId, deckId) {
  return withFlashTransaction(async (client) => {
    await client.query(
      `delete from answer_events where user_id=$1 and deck_id=$2`,
      [userId, deckId]
    );
    await client.query(
      `delete from study_sessions where user_id=$1 and deck_id=$2`,
      [userId, deckId]
    );
    await client.query(
      `delete from card_progress where user_id=$1 and deck_id=$2`,
      [userId, deckId]
    );
    return true;
  });
}
