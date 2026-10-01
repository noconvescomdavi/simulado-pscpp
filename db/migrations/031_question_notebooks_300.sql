ALTER TABLE public.question_notebooks
  DROP CONSTRAINT IF EXISTS question_notebooks_total_questions_check;

ALTER TABLE public.question_notebooks
  ADD CONSTRAINT question_notebooks_total_questions_check
  CHECK (total_questions BETWEEN 1 AND 300);
