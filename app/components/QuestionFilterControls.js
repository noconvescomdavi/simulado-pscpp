"use client";

import styles from "./question-filters.module.css";

export const EMPTY_QUESTION_FILTERS = {
  work_id: "",
  chapter_id: "",
  module: "",
  scenario_only: false,
  official_exam_only: false,
  query: "",
};

function forSubjects(items, subjects) {
  if (!subjects?.length) return items || [];
  return (items || []).filter((item) =>
    item.subjects?.some((subject) => subjects.includes(subject))
  );
}

export default function QuestionFilterControls({
  facets,
  value,
  onChange,
  subjects = [],
  disabled = false,
  showOfficialExamFilter = true,
}) {
  const works = forSubjects(facets?.works, subjects);
  const modules = forSubjects(facets?.modules, subjects);
  const chapters = forSubjects(facets?.chapters, subjects).filter(
    (chapter) => !value.work_id || chapter.work_id === value.work_id
  );

  function change(field, nextValue) {
    const next = { ...value, [field]: nextValue };
    if (field === "work_id") next.chapter_id = "";
    if (field === "official_exam_only" && nextValue) {
      next.work_id = "";
      next.chapter_id = "";
      next.module = "";
    }
    onChange(next);
  }

  const hasHierarchy = works.length || chapters.length || modules.length;

  return (
    <fieldset className={styles.filters} disabled={disabled}>
      <legend>Filtrar o conteúdo das questões</legend>
      <p>Escolha os campos desejados. Os filtros vazios incluem todo o conteúdo selecionado.</p>

      <div className={styles.grid}>
        {hasHierarchy && <label>
          Obra
          <select value={value.work_id} onChange={(event) => change("work_id", event.target.value)}>
            <option value="">Todas as obras</option>
            {works.map((work) => (
              <option key={work.id} value={work.id}>
                {work.label} ({work.count})
              </option>
            ))}
          </select>
        </label>}

        {hasHierarchy && <label>
          Capítulo
          <select value={value.chapter_id} onChange={(event) => change("chapter_id", event.target.value)}>
            <option value="">Todos os capítulos</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.label} ({chapter.count})
              </option>
            ))}
          </select>
        </label>}

        {hasHierarchy && <label>
          Assunto
          <select value={value.module} onChange={(event) => change("module", event.target.value)}>
            <option value="">Todos os assuntos</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.label} ({module.count})
              </option>
            ))}
          </select>
        </label>}

        {showOfficialExamFilter && <label>
          Origem
          <span className={styles.checkLine}>
            <input
              type="checkbox"
              checked={Boolean(value.official_exam_only)}
              onChange={(event) => change("official_exam_only", event.target.checked)}
            />
            Somente provas anteriores (254 no acervo · 252 ativas)
          </span>
        </label>}

        <label>
          Tipo de questão
          <span className={styles.checkLine}>
            <input
              type="checkbox"
              checked={Boolean(value.scenario_only)}
              onChange={(event) => change("scenario_only", event.target.checked)}
            />
            Somente RIPEAM / situações de manobra
          </span>
        </label>

        <label>
          Buscar termo
          <input
            type="search"
            value={value.query}
            maxLength={120}
            placeholder="Ex.: âncora, rebocador, atracação"
            onChange={(event) => change("query", event.target.value)}
          />
        </label>
      </div>

      {Object.values(value).some(Boolean) && (
        <button
          className={styles.clear}
          type="button"
          onClick={() => onChange({ ...EMPTY_QUESTION_FILTERS })}
        >
          Limpar filtros
        </button>
      )}
    </fieldset>
  );
}
