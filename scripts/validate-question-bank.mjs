import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const file = path.resolve(
  process.argv[2] || "data/questions/conhecimentos-gerais.json"
);

const required = [
  "id",
  "subject",
  "module",
  "topic_code",
  "topic",
  "difficulty",
  "style",
  "question",
  "correct_answer",
  "explanation",
];

const sourceRequired = ["author", "title", "edition", "locator"];
const keys = ["A", "B", "C", "D", "E"];

const difficulties = new Set([
  "Fácil",
  "Médio",
  "Difícil",
]);

const styles = new Set([
  "Conceitual",
  "Aplicada",
  "Situacional",
  "Cálculo",
  "Normativa",
  "Sequencial",
]);

const errors = [];

const add = (id, message) => {
  errors.push(`${id}: ${message}`);
};

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const countBy = (items, select) => {
  const result = {};

  for (const item of items) {
    const key = select(item);
    result[key] = (result[key] || 0) + 1;
  }

  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) =>
      a.localeCompare(b, "pt-BR")
    )
  );
};

const ordered = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).sort(([a], [b]) =>
      a.localeCompare(b, "pt-BR")
    )
  );
};

const sameCounts = (left, right) =>
  JSON.stringify(ordered(left)) === JSON.stringify(ordered(right));

const trigrams = (value) => {
  const words = normalize(value).split(/\s+/).filter(Boolean);

  if (words.length <= 3) {
    return new Set([words.join(" ")]);
  }

  return new Set(
    words
      .slice(0, words.length - 2)
      .map((_, index) => words.slice(index, index + 3).join(" "))
  );
};

const jaccard = (left, right) => {
  const small = left.size <= right.size ? left : right;
  const large = left.size <= right.size ? right : left;

  let intersection = 0;

  for (const item of small) {
    if (large.has(item)) intersection++;
  }

  return intersection / (
    left.size + right.size - intersection || 1
  );
};

let bank;

try {
  const raw = await readFile(file, "utf8");

  if (raw.includes("\uFFFD")) {
    throw new Error(
      "contém caractere Unicode de substituição U+FFFD"
    );
  }

  bank = JSON.parse(raw);
} catch (error) {
  console.error(
    `FALHA: não foi possível ler ${file}: ${error.message}`
  );

  process.exit(1);
}

if (bank.schema_version !== "1.0") {
  add("metadata", "schema_version deve ser 1.0");
}

if (bank.language !== "pt-BR") {
  add("metadata", "language deve ser pt-BR");
}

if (
  bank.question_type !== "multiple_choice_single_answer"
) {
  add("metadata", "question_type inválido");
}

if (!Array.isArray(bank.questions)) {
  add("metadata", "questions deve ser um array");
}

const questions = Array.isArray(bank.questions)
  ? bank.questions
  : [];

if (questions.length < 1000) {
  add(
    "metadata",
    `há ${questions.length} questões; o mínimo é 1000`
  );
}

if (bank.validation?.total !== questions.length) {
  add(
    "metadata",
    "validation.total diverge do total real"
  );
}

const ids = new Set();
const statements = new Map();

let priorAnswer = null;
let currentRun = 0;
let longestRun = 0;

questions.forEach((question, index) => {
  const id = question?.id || `índice ${index}`;

  for (const field of required) {
    if (
      typeof question?.[field] !== "string" ||
      !question[field].trim()
    ) {
      add(id, `${field} deve ser texto não vazio`);
    }
  }

  if (!/^CGE-\d{4}$/.test(String(question?.id || ""))) {
    add(id, "ID deve seguir o padrão CGE-0001");
  }

  if (ids.has(question?.id)) {
    add(id, "ID duplicado");
  }

  ids.add(question?.id);

  if (
    question?.subject !==
    "VII — Conhecimentos Gerais"
  ) {
    add(id, "subject divergente");
  }

  if (
    !String(question?.topic_code || "").startsWith("CGE.")
  ) {
    add(id, "topic_code deve começar por CGE.");
  }

  if (!difficulties.has(question?.difficulty)) {
    add(id, "difficulty inválida");
  }

  if (!styles.has(question?.style)) {
    add(id, "style inválido");
  }

  if (
    !Array.isArray(question?.options) ||
    question.options.length !== 5
  ) {
    add(
      id,
      "options deve conter exatamente cinco alternativas"
    );
  } else {
    const optionKeys = question.options.map(
      (option) => option?.key
    );

    const optionTexts = question.options.map(
      (option) => String(option?.text || "").trim()
    );

    if (
      JSON.stringify(optionKeys) !== JSON.stringify(keys)
    ) {
      add(
        id,
        "as chaves devem ser A, B, C, D e E, nessa ordem"
      );
    }

    if (optionTexts.some((text) => !text)) {
      add(id, "há alternativa vazia");
    }

    if (
      new Set(optionTexts.map(normalize)).size !== 5
    ) {
      add(id, "há alternativas duplicadas");
    }
  }

  if (!keys.includes(question?.correct_answer)) {
    add(
      id,
      "correct_answer não aponta para A, B, C, D ou E"
    );
  }

  if (
    !question?.source ||
    typeof question.source !== "object" ||
    Array.isArray(question.source)
  ) {
    add(id, "source deve ser objeto");
  } else {
    for (const field of sourceRequired) {
      if (
        typeof question.source[field] !== "string" ||
        !question.source[field].trim()
      ) {
        add(
          id,
          `source.${field} deve ser texto não vazio`
        );
      }
    }
  }

  if (
    !Array.isArray(question?.tags) ||
    !question.tags.length ||
    question.tags.some(
      (tag) =>
        typeof tag !== "string" ||
        !tag.trim()
    )
  ) {
    add(id, "tags inválidas");
  }

  const textualContent = [
    question?.question,
    question?.explanation,
    ...(question?.options || []).map(
      (option) => option?.text
    ),
  ].join(" ");

  if (
    /\b(?:TODO|TBD)\b|[Ll][Oo][Rr][Ee][Mm] [Ii][Pp][Ss][Uu][Mm]|\[(?:ALTERNATIVA|TRECHO|alternativa|trecho)/.test(
      textualContent
    )
  ) {
    add(id, "há marcador provisório");
  }

  if (
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(
      textualContent
    )
  ) {
    add(id, "há caractere de controle inválido");
  }

  const normalizedStatement = normalize(
    question?.question
  );

  if (statements.has(normalizedStatement)) {
    add(
      id,
      `enunciado duplicado de ${statements.get(
        normalizedStatement
      )}`
    );
  } else {
    statements.set(normalizedStatement, id);
  }

  if (
    question?.correct_answer === priorAnswer
  ) {
    currentRun++;
  } else {
    currentRun = 1;
  }

  priorAnswer = question?.correct_answer;
  longestRun = Math.max(longestRun, currentRun);
});

if (longestRun > 3) {
  add(
    "gabarito",
    `há uma sequência de ${longestRun} respostas iguais; o máximo é 3`
  );
}

const actual = {
  total: questions.length,

  by_module: countBy(
    questions,
    (question) => question.module
  ),

  by_difficulty: countBy(
    questions,
    (question) => question.difficulty
  ),

  by_style: countBy(
    questions,
    (question) => question.style
  ),

  answer_balance: countBy(
    questions,
    (question) => question.correct_answer
  ),
};

for (const field of [
  "by_module",
  "by_difficulty",
  "by_style",
  "answer_balance",
]) {
  if (
    !sameCounts(
      bank.validation?.[field],
      actual[field]
    )
  ) {
    add(
      "metadata",
      `validation.${field} diverge da contagem real`
    );
  }
}

if (
  questions.length === 1000 &&
  keys.some(
    (key) => actual.answer_balance[key] !== 200
  )
) {
  add(
    "gabarito",
    "cada alternativa deve ser correta exatamente 200 vezes"
  );
}

const fingerprints = questions.map((question) =>
  trigrams(
    [
      question.question,
      ...(question.options || []).map(
        (option) => option.text
      ),
    ].join(" ")
  )
);

const nearDuplicates = [];

for (
  let left = 0;
  left < questions.length;
  left++
) {
  for (
    let right = left + 1;
    right < questions.length;
    right++
  ) {
    const similarity = jaccard(
      fingerprints[left],
      fingerprints[right]
    );

    if (similarity >= 0.82) {
      nearDuplicates.push({
        left: questions[left].id,
        right: questions[right].id,
        similarity: Number(
          similarity.toFixed(3)
        ),
      });
    }
  }
}

for (const pair of nearDuplicates.slice(0, 25)) {
  add(
    "similaridade",
    `${pair.left}/${pair.right} atingem ${pair.similarity}`
  );
}

if (nearDuplicates.length > 25) {
  add(
    "similaridade",
    `${nearDuplicates.length - 25} pares adicionais omitidos`
  );
}

const result = {
  status: errors.length ? "FALHA" : "OK",
  file,
  similarity_threshold: 0.82,
  longest_answer_run: longestRun,
  exact_duplicates:
    questions.length - statements.size,
  near_duplicates: nearDuplicates.length,
  actual,
  errors,
};

console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
