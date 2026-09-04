BEGIN;

WITH target AS (
  SELECT id, cards FROM decks WHERE slug='cis' FOR UPDATE
),
expanded AS (
  SELECT t.id,e.value,e.ordinality,
         max(CASE WHEN e.value->>'id'='Z' THEN e.ordinality END) OVER (PARTITION BY t.id) AS z_ord
  FROM target t
  CROSS JOIN LATERAL jsonb_array_elements(t.cards) WITH ORDINALITY e(value,ordinality)
),
clean AS (
  SELECT * FROM expanded
  WHERE COALESCE(value->>'category','') <> 'numerals'
    AND COALESCE(value->>'id','') NOT LIKE 'NUM%'
),
parts AS (
  SELECT id,
    COALESCE(jsonb_agg(value ORDER BY ordinality) FILTER (WHERE ordinality <= z_ord),'[]'::jsonb) before_z,
    COALESCE(jsonb_agg(value ORDER BY ordinality) FILTER (WHERE ordinality > z_ord),'[]'::jsonb) after_z
  FROM clean GROUP BY id
),
nums AS (
  SELECT jsonb_build_array(
    jsonb_build_object('id','NUM0','code','0','name','NADAZERO','category','numerals','pt','Representa o numeral 0 (zero) no Código Internacional de Sinais.','en','Represents numeral 0 (zero) in the International Code of Signals.'),
    jsonb_build_object('id','NUM1','code','1','name','UNAONE','category','numerals','pt','Representa o numeral 1 (um) no Código Internacional de Sinais.','en','Represents numeral 1 (one) in the International Code of Signals.'),
    jsonb_build_object('id','NUM2','code','2','name','BISSOTWO','category','numerals','pt','Representa o numeral 2 (dois) no Código Internacional de Sinais.','en','Represents numeral 2 (two) in the International Code of Signals.'),
    jsonb_build_object('id','NUM3','code','3','name','TERRATHREE','category','numerals','pt','Representa o numeral 3 (três) no Código Internacional de Sinais.','en','Represents numeral 3 (three) in the International Code of Signals.'),
    jsonb_build_object('id','NUM4','code','4','name','KARTFOUR','category','numerals','pt','Representa o numeral 4 (quatro) no Código Internacional de Sinais.','en','Represents numeral 4 (four) in the International Code of Signals.'),
    jsonb_build_object('id','NUM5','code','5','name','PANTAFIVE','category','numerals','pt','Representa o numeral 5 (cinco) no Código Internacional de Sinais.','en','Represents numeral 5 (five) in the International Code of Signals.'),
    jsonb_build_object('id','NUM6','code','6','name','SOXISIX','category','numerals','pt','Representa o numeral 6 (seis) no Código Internacional de Sinais.','en','Represents numeral 6 (six) in the International Code of Signals.'),
    jsonb_build_object('id','NUM7','code','7','name','SETESEVEN','category','numerals','pt','Representa o numeral 7 (sete) no Código Internacional de Sinais.','en','Represents numeral 7 (seven) in the International Code of Signals.'),
    jsonb_build_object('id','NUM8','code','8','name','OHTOEIGHT','category','numerals','pt','Representa o numeral 8 (oito) no Código Internacional de Sinais.','en','Represents numeral 8 (eight) in the International Code of Signals.'),
    jsonb_build_object('id','NUM9','code','9','name','NOVENINE','category','numerals','pt','Representa o numeral 9 (nove) no Código Internacional de Sinais.','en','Represents numeral 9 (nine) in the International Code of Signals.')
  ) cards
)
UPDATE decks d
SET cards=p.before_z || n.cards || p.after_z,
    description='Flashcards interativos do Código Internacional de Sinais, com bandeiras alfabéticas, flâmulas numerais, combinações, sinais de perigo e sinais médicos.',
    updated_at=NOW()
FROM parts p CROSS JOIN nums n
WHERE d.id=p.id;

COMMIT;

SELECT slug,
       jsonb_array_length(cards) AS total_cartoes,
       (SELECT count(*) FROM jsonb_array_elements(cards) c WHERE c->>'category'='numerals') AS total_numerais
FROM decks WHERE slug='cis';
