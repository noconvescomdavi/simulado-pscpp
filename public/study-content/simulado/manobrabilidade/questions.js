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
  next: document.querySelector("#qbNext"),
  stop: document.querySelector("#qbStop"),
  result: document.querySelector("#qbResult"),
  resultScore: document.querySelector("#qbResultScore"),
  resultText: document.querySelector("#qbResultText"),
  restart: document.querySelector("#qbRestart"),
};

let bank = [];
let queue = [];
let currentIndex = 0;
let correctAnswers = 0;
let answered = 0;
let locked = false;
let startedAt = 0;

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
  return items;
}

function sourceText(question) {
  const source = question.source || {};
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
    const response = await fetch("/api/questions/manobrabilidade", {
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
  elements.feedback.className = "qb-feedback hidden";
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
    button.addEventListener("click", () => answerQuestion(button, question));
    elements.options.append(button);
  }
}

function answerQuestion(selectedButton, question) {
  if (locked) return;
  locked = true;
  answered += 1;
  const isCorrect = selectedButton.dataset.key === question.correct_answer;
  if (isCorrect) correctAnswers += 1;

  for (const button of elements.options.querySelectorAll("button")) {
    button.disabled = true;
    if (button.dataset.key === question.correct_answer) button.classList.add("correct");
  }
  if (!isCorrect) selectedButton.classList.add("wrong");

  elements.score.textContent = `${correctAnswers} ${correctAnswers === 1 ? "acerto" : "acertos"}`;
  elements.feedback.className = `qb-feedback ${isCorrect ? "correct" : "wrong"}`;
  elements.feedbackTitle.textContent = isCorrect
    ? `Resposta correta: ${question.correct_answer}`
    : `Resposta incorreta. Gabarito: ${question.correct_answer}`;
  elements.explanation.textContent = question.explanation;
  elements.source.textContent = `Fonte: ${sourceText(question)}`;
  elements.next.textContent = currentIndex === queue.length - 1 ? "Ver resultado" : "Próxima questão";
  elements.next.classList.remove("hidden");
  elements.progress.style.width = `${((currentIndex + 1) / queue.length) * 100}%`;
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
  elements.resultText.textContent = `${correctAnswers} acertos e ${answered - correctAnswers} erros em ${answered} questões.`;
  elements.result.classList.remove("hidden");

  try {
    await fetch("/api/attempts", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module: selectedModule === "all" ? "Banco completo" : selectedModule,
        subject: "manobrabilidade",
        score_percent: scorePercent,
        correct_answers: correctAnswers,
        wrong_answers: answered - correctAnswers,
        total_questions: answered,
        duration_seconds: durationSeconds,
      }),
    });
  } catch {
    // O resultado continua visível mesmo se o registro de desempenho falhar.
  }
}

function returnToSetup() {
  elements.exam.classList.add("hidden");
  elements.result.classList.add("hidden");
  elements.setup.classList.remove("hidden");
  document.querySelector("#questionBank").scrollIntoView({ behavior: "smooth" });
}

elements.start.addEventListener("click", startExam);
elements.next.addEventListener("click", nextQuestion);
elements.stop.addEventListener("click", finishExam);
elements.restart.addEventListener("click", returnToSetup);

loadBank();
