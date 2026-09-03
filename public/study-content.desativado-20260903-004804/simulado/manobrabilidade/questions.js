const elements = {
  loading: document.querySelector("#qbLoading"),
  error: document.querySelector("#qbError"),
  setup: document.querySelector("#qbSetup"),
  module: document.querySelector("#qbModule"),
  amount: document.querySelector("#qbAmount"),
  start: document.querySelector("#qbStart"),
  total: document.querySelector("#qbTotal"),
  exam: document.querySelector("#qbExam"),
  position: document.querySelector("#qbPosition"),
  score: document.querySelector("#qbScore"),
  progress: document.querySelector("#qbProgress"),
  id: document.querySelector("#qbId"),
  topic: document.querySelector("#qbTopic"),
  question: document.querySelector("#qbQuestion"),
  options: document.querySelector("#qbOptions"),
  feedback: document.querySelector("#qbFeedback"),
  feedbackTitle: document.querySelector("#qbFeedbackTitle"),
  explanation: document.querySelector("#qbExplanation"),
  source: document.querySelector("#qbSource"),
  save: document.querySelector("#qbSave"),
  next: document.querySelector("#qbNext"),
  stop: document.querySelector("#qbStop"),
  result: document.querySelector("#qbResult"),
  resultScore: document.querySelector("#qbResultScore"),
  resultText: document.querySelector("#qbResultText"),
  restart: document.querySelector("#qbRestart"),
};

const SUBJECT = "manobrabilidade";
let bank = [];
let queue = [];
let currentIndex = 0;
let correctAnswers = 0;
let answered = 0;
let locked = false;
let selectedAnswer = null;
let startedAt = 0;
let questionStartedAt = 0;

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
  return items;
}

function sourceText(source = {}) {
  return [source.author, source.title, source.edition, source.locator]
    .filter(Boolean)
    .join(". ");
}

function showError(message) {
  elements.loading.classList.add("hidden");
  elements.setup.classList.add("hidden");
  elements.error.textContent = message;
  elements.error.classList.remove("hidden");
}

async function loadBank() {
  try {
    const response = await fetch(`/api/questions/${SUBJECT}`, {
      credentials: "same-origin",
      cache: "no-store",
    });

    if (response.status === 401) {
      location.href = `/login?next=${encodeURIComponent(location.pathname)}`;
      return;
    }
    if (response.status === 403) {
      location.href = "/comprar?locked=1";
      return;
    }
    if (!response.ok) throw new Error("Não foi possível carregar as questões.");

    const payload = await response.json();
    if (!Array.isArray(payload.questions) || !payload.questions.length) {
      throw new Error("O banco de questões está vazio.");
    }

    bank = payload.questions;
    elements.total.textContent = String(bank.length);

    const modules = [...new Set(bank.map((question) => question.module))].sort();
    for (const module of modules) {
      const option = document.createElement("option");
      option.value = module;
      option.textContent = `${module} (${bank.filter((q) => q.module === module).length})`;
      elements.module.append(option);
    }

    elements.loading.classList.add("hidden");
    elements.setup.classList.remove("hidden");
  } catch (error) {
    showError(error.message || "Erro ao carregar o banco de questões.");
  }
}

function startExam() {
  const selectedModule = elements.module.value;
  const available = bank.filter(
    (question) => selectedModule === "all" || question.module === selectedModule
  );
  const requestedAmount = Number(elements.amount.value);

  queue = shuffle([...available]).slice(0, Math.min(requestedAmount, available.length));
  currentIndex = 0;
  correctAnswers = 0;
  answered = 0;
  locked = false;
  selectedAnswer = null;
  startedAt = Date.now();

  elements.setup.classList.add("hidden");
  elements.result.classList.add("hidden");
  elements.exam.classList.remove("hidden");
  renderQuestion();
  elements.exam.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderQuestion() {
  const question = queue[currentIndex];
  locked = false;
  selectedAnswer = null;
  questionStartedAt = Date.now();
  elements.feedback.className = "qb-feedback hidden";
  elements.save.disabled = true;
  elements.save.textContent = "Salvar resposta";
  elements.save.classList.remove("hidden");
  elements.next.classList.add("hidden");
  elements.position.textContent = `Questão ${currentIndex + 1} de ${queue.length}`;
  elements.score.textContent = `${correctAnswers} ${correctAnswers === 1 ? "acerto" : "acertos"}`;
  elements.progress.style.width = `${(currentIndex / queue.length) * 100}%`;
  elements.id.textContent = question.id;
  elements.topic.textContent = question.topic;
  elements.question.textContent = question.question;
  elements.options.replaceChildren();

  for (const option of question.options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "qb-option";
    button.dataset.key = option.key;

    const key = document.createElement("b");
    key.textContent = option.key;
    const text = document.createElement("span");
    text.textContent = option.text;
    button.append(key, text);
    button.addEventListener("click", () => selectOption(button));
    elements.options.append(button);
  }
}

function selectOption(button) {
  if (locked) return;
  selectedAnswer = button.dataset.key;
  for (const option of elements.options.querySelectorAll("button")) {
    option.classList.toggle("selected", option === button);
  }
  elements.save.disabled = false;
}

async function saveAnswer() {
  if (locked || !selectedAnswer) return;
  locked = true;
  elements.save.disabled = true;
  elements.save.textContent = "Salvando...";
  const question = queue[currentIndex];

  try {
    const response = await fetch(`/api/questions/${SUBJECT}/answer`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: question.id,
        selected_answer: selectedAnswer,
        response_time_ms: Date.now() - questionStartedAt,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Não foi possível salvar a resposta.");

    answered += 1;
    if (result.is_correct) correctAnswers += 1;

    for (const button of elements.options.querySelectorAll("button")) {
      button.disabled = true;
      button.classList.remove("selected");
      if (button.dataset.key === result.correct_answer) button.classList.add("correct");
    }
    const selectedButton = elements.options.querySelector(`[data-key="${selectedAnswer}"]`);
    if (!result.is_correct) selectedButton?.classList.add("wrong");

    elements.score.textContent = `${correctAnswers} ${correctAnswers === 1 ? "acerto" : "acertos"}`;
    elements.feedback.className = `qb-feedback ${result.is_correct ? "correct" : "wrong"}`;
    elements.feedbackTitle.textContent = result.is_correct
      ? `Você acertou. Gabarito: ${result.correct_answer}`
      : `Você errou. Gabarito: ${result.correct_answer}`;
    elements.explanation.textContent = result.explanation;
    elements.source.textContent = `Fonte: ${sourceText(result.source)}`;
    elements.save.classList.add("hidden");
    elements.next.textContent = currentIndex === queue.length - 1 ? "Ver resultado" : "Próxima questão";
    elements.next.classList.remove("hidden");
    elements.progress.style.width = `${((currentIndex + 1) / queue.length) * 100}%`;
  } catch (error) {
    locked = false;
    elements.save.disabled = false;
    elements.save.textContent = "Tentar salvar novamente";
    elements.feedback.className = "qb-feedback wrong";
    elements.feedbackTitle.textContent = "Resposta ainda não salva";
    elements.explanation.textContent = error.message;
    elements.source.textContent = "Verifique sua conexão e tente novamente.";
  }
}

function nextQuestion() {
  if (!locked) return;
  if (currentIndex < queue.length - 1) {
    currentIndex += 1;
    renderQuestion();
    elements.exam.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  finishExam();
}

async function finishExam() {
  if (!answered) {
    returnToSetup();
    return;
  }

  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  const scorePercent = Math.round((correctAnswers / answered) * 10000) / 100;
  const selectedModule = elements.module.value;

  elements.exam.classList.add("hidden");
  elements.resultScore.textContent = `${Math.round(scorePercent)}%`;
  elements.resultText.textContent = `${correctAnswers} acertos e ${answered - correctAnswers} erros em ${answered} questões. As estatísticas foram atualizadas na Área do Aluno.`;
  elements.result.classList.remove("hidden");

  try {
    const response = await fetch("/api/attempts", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module: selectedModule === "all" ? "Banco completo" : selectedModule,
        subject: SUBJECT,
        score_percent: scorePercent,
        correct_answers: correctAnswers,
        wrong_answers: answered - correctAnswers,
        total_questions: answered,
        duration_seconds: durationSeconds,
      }),
    });
    if (!response.ok) throw new Error("Resumo não registrado");
  } catch {
    elements.resultText.textContent += " As respostas individuais foram salvas, mas o resumo desta prova não pôde ser registrado.";
  }
}

function returnToSetup() {
  elements.exam.classList.add("hidden");
  elements.result.classList.add("hidden");
  elements.setup.classList.remove("hidden");
  document.querySelector("#questionBank").scrollIntoView({ behavior: "smooth" });
}

elements.start.addEventListener("click", startExam);
elements.save.addEventListener("click", saveAnswer);
elements.next.addEventListener("click", nextQuestion);
elements.stop.addEventListener("click", finishExam);
elements.restart.addEventListener("click", returnToSetup);

loadBank();
