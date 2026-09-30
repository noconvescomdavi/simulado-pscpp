"use client";

import styles from "./question-filters.module.css";

export const EMPTY_QUESTION_FILTERS = {
  official_only: false,
  exam_year: "",
  work_id: "",
  chapter_id: "",
  module: "",
  scenario_only: false,
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
  allowOfficial = false,
}) {
  const works = forSubjects(facets?.works, subjects);
  const modules = forSubjects(facets?.modules, subjects);
  const chapters = forSubjects(facets?.chapters, subjects).filter(
    (chapter) => !value.work_id || chapter.work_id === value.work_id
  );

  function change(field, nextValue) {
    const next = { ...value, [field]: nextValue };
    if (field === "work_id") next.chapter_id = "";
    onChange(next);
  }

  const hasHierarchy = works.length || chapters.length || modules.length;
  if (!hasHierarchy && !allowOfficial) return null;

  return (
    <fieldset className={styles.filters} disabled={disabled}>
      <legend>Filtrar o conteúdo das questões</legend>
      <p>Escolha os campos desejados. Os filtros vazios incluem todo o conteúdo selecionado.</p>

      {allowOfficial && (
        <label className={styles.checkLine}>
          <input type="checkbox" checked={Boolean(value.official_only)}
            onChange={event => onChange({...EMPTY_QUESTION_FILTERS, official_only: event.target.checked})} />
          Somente questões oficiais de provas anteriores
        </label>
      )}
      {allowOfficial && value.official_only && (
        <>
          <p>Enunciados originais de 2006, 2008, 2011 e 2012. Questões anuladas e itens com extração incompleta ficam de fora. Se houver menos questões, o caderno terá apenas as disponíveis.</p>
          <label>
            Ano da prova
            <select value={value.exam_year || ""} onChange={event => onChange({...EMPTY_QUESTION_FILTERS,
              official_only: true, exam_year: event.target.value})}>
              <option value="">Todos os anos</option>
              {[2006, 2008, 2011, 2012].map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
        </>
      )}

      <div className={styles.grid}>
        <label>
          Obra
          <select value={value.work_id} onChange={(event) => change("work_id", event.target.value)}>
            <option value="">Todas as obras</option>
            {works.map((work) => (
              <option key={work.id} value={work.id}>
                {work.label} ({work.count})
              </option>
            ))}
          </select>
        </label>

        <label>
          Capítulo
          <select value={value.chapter_id} onChange={(event) => change("chapter_id", event.target.value)}>
            <option value="">Todos os capítulos</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.label} ({chapter.count})
              </option>
            ))}
          </select>
        </label>

        <label>
          Assunto
          <select value={value.module} onChange={(event) => change("module", event.target.value)}>
            <option value="">Todos os assuntos</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.label} ({module.count})
              </option>
            ))}
          </select>
        </label>

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
