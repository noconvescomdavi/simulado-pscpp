(() => {
  "use strict";

  const STORAGE_KEY = "cisFlashcards:v2";

  // Conteúdo de estudo baseado no material fornecido pelo usuário.
  // Nas combinações cujo trecho-base apresenta apenas português,
  // o campo EN é uma tradução de estudo para permitir alternância bilíngue.
  const CARDS = [
    {id:"A", code:"A", name:"Alfa", category:"flags", pt:"Tenho um mergulhador na água; conserve-se afastado e a pouca velocidade.", en:"I have a diver down; keep well clear at slow speed."},
    {id:"B", code:"B", name:"Bravo", category:"flags", pt:"Carrego, descarrego ou transporto carga perigosa.", en:"I am taking in or discharging or carrying dangerous goods."},
    {id:"C", code:"C", name:"Charlie", category:"flags", pt:"Sim (Afirmativo).", en:"Affirmative."},
    {id:"D", code:"D", name:"Delta", category:"flags", pt:"Mantenha-se afastado, estou a manobrar com dificuldade.", en:"Keep clear of me; I am maneuvering with difficulty."},
    {id:"E", code:"E", name:"Echo", category:"flags", pt:"Estou a guinar para estibordo (EB).", en:"I am altering my course to starboard."},
    {id:"F", code:"F", name:"Foxtrot", category:"flags", pt:"Estou com avaria; comunique comigo.", en:"I am disabled; communicate with me."},
    {id:"G", code:"G", name:"Golf", category:"flags", pt:"Necessito de um piloto.", en:"I require a pilot."},
    {id:"H", code:"H", name:"Hotel", category:"flags", pt:"Tenho piloto a bordo.", en:"I have a pilot on board."},
    {id:"I", code:"I", name:"India", category:"flags", pt:"Estou a guinar para bombordo (BB).", en:"I am altering my course to port."},
    {id:"J", code:"J", name:"Juliet", category:"flags", pt:"Estou com incêndio a bordo: mantenha-se afastado.", en:"I am going to send a message by semaphore.", note:"O material-base fornecido apresenta significados PT e EN divergentes para a bandeira J."},
    {id:"K", code:"K", name:"Kilo", category:"flags", pt:"Tenho uma comunicação a fazer.", en:"I wish to communicate with you."},
    {id:"L", code:"L", name:"Lima", category:"flags", pt:"Você deve parar sua embarcação imediatamente.", en:"At sea: You should stop your vessel instantly.", note:"O material-base também registra, em porto: “The ship is quarantined.”"},
    {id:"M", code:"M", name:"Mike", category:"flags", pt:"O meu navio está parado.", en:"My vessel is stopped and making no way through the water."},
    {id:"N", code:"N", name:"November", category:"flags", pt:"Não (Negativo).", en:"Negative."},
    {id:"O", code:"O", name:"Oscar", category:"flags", pt:"Homem ao mar.", en:"Man overboard."},
    {id:"P", code:"P", name:"Papa", category:"flags", pt:"No porto: todas as pessoas devem regressar a bordo pois o navio vai largar. No mar, por embarcações de pesca: minhas redes estão presas numa obstrução.", en:"In harbour: All persons should report on board as the vessel is about to proceed to sea. At sea, by fishing vessels: My nets have come fast upon an obstruction."},
    {id:"Q", code:"Q", name:"Quebec", category:"flags", pt:"Peço livre prática (licença para entrar em porto).", en:"My vessel is healthy and I request free pratique."},
    {id:"R", code:"R", name:"Romeo", category:"flags", pt:"Sem significado no material-base para o Código Internacional de Sinais.", en:"No meaning is assigned in the supplied study material.", note:"O material-base menciona usos específicos da Marinha Portuguesa fora deste significado CIS."},
    {id:"S", code:"S", name:"Sierra", category:"flags", pt:"Estou a fazer marcha a ré a toda a força.", en:"I am operating astern propulsion."},
    {id:"T", code:"T", name:"Tango", category:"flags", pt:"Mantenha-se afastado. Em embarcações de pesca: mantenha-se afastado; estou empenhado em arrasto de parelha.", en:"Keep clear of me. Fishing boats: Keep clear of me; I am engaged in pair trawling."},
    {id:"U", code:"U", name:"Uniform", category:"flags", pt:"Vai sobre um perigo.", en:"You are running into danger."},
    {id:"V", code:"V", name:"Victor", category:"flags", pt:"Peço assistência.", en:"I require assistance."},
    {id:"W", code:"W", name:"Whiskey", category:"flags", tags:["medical"], pt:"Peço assistência médica.", en:"I require medical assistance."},
    {id:"X", code:"X", name:"Xray", category:"flags", pt:"Pare as suas manobras.", en:"Stop carrying out your intentions and watch for my signals."},
    {id:"Y", code:"Y", name:"Yankee", category:"flags", pt:"Estou a garrar (arrastar a âncora).", en:"I am dragging my anchor."},
    {id:"Z", code:"Z", name:"Zulu", category:"flags", pt:"Peço reboque.", en:"I require a tug.", note:"O material-base também registra uso por embarcações de pesca próximo aos pesqueiros: “I am shooting nets.”"},

    {id:"AC", code:"AC", name:"", category:"combinations", pt:"Estou a abandonar o meu navio.", en:"I am abandoning my vessel."},
    {id:"AN", code:"AN", name:"", category:"combinations", tags:["medical"], pt:"Preciso de um médico.", en:"I need a doctor."},
    {id:"BR", code:"BR", name:"", category:"combinations", pt:"Necessito de um helicóptero.", en:"I require a helicopter."},
    {id:"CD", code:"CD", name:"", category:"combinations", tags:["distress"], pt:"Peço assistência imediata.", en:"I require immediate assistance."},
    {id:"DV", code:"DV", name:"", category:"combinations", pt:"Estou à deriva.", en:"I am drifting."},
    {id:"EF", code:"EF", name:"", category:"combinations", tags:["distress"], pt:"O SOS/MAYDAY encontra-se cancelado.", en:"SOS/MAYDAY is cancelled."},
    {id:"FA", code:"FA", name:"", category:"combinations", pt:"Pode fornecer-me a minha posição?", en:"Can you give me my position?"},
    {id:"GW", code:"GW", name:"", category:"combinations", tags:["distress"], pt:"Homem ao mar. Efetue a sua recolha.", en:"Man overboard. Please take action to pick him up."},
    {id:"JL", code:"JL", name:"", category:"combinations", tags:["distress"], pt:"Corre o risco de encalhar.", en:"You are running the risk of going aground."},
    {id:"NC", code:"NC", name:"Distress", category:"combinations", tags:["distress"], pt:"Estou em perigo e peço assistência imediata.", en:"I am in distress and require immediate assistance."},
    {id:"PD", code:"PD", name:"", category:"combinations", pt:"As suas luzes de navegação não são visíveis.", en:"Your navigation lights are not visible."},
    {id:"PP", code:"PP", name:"", category:"combinations", pt:"Mantenha-se bastante afastado de mim.", en:"Keep well clear of me."},
    {id:"QD", code:"QD", name:"", category:"combinations", pt:"Estou a deslocar-me para vante.", en:"I am moving ahead."},
    {id:"QT", code:"QT", name:"", category:"combinations", pt:"Estou a deslocar-me para ré.", en:"I am moving astern."},
    {id:"QU", code:"QU", name:"", category:"combinations", pt:"Fundear não é permitido.", en:"Anchoring is not permitted."},
    {id:"QX", code:"QX", name:"", category:"combinations", pt:"Solicito autorização para fundear.", en:"I request permission to anchor."},
    {id:"RU", code:"RU", name:"", category:"combinations", pt:"Mantenha-se afastado de mim. Estou a manobrar com dificuldade.", en:"Keep clear of me. I am maneuvering with difficulty."},
    {id:"SO", code:"SO", name:"", category:"combinations", pt:"Deve parar o seu navio imediatamente.", en:"You should stop your vessel immediately."},
    {id:"UM", code:"UM", name:"", category:"combinations", pt:"O porto está fechado ao tráfego marítimo.", en:"The harbour is closed to maritime traffic."},
    {id:"UP", code:"UP", name:"", category:"combinations", tags:["distress"], pt:"Solicito autorização para entrar no porto com urgência. Encontro-me em dificuldades.", en:"I urgently request permission to enter harbour. I am in difficulty."},
    {id:"YU", code:"YU", name:"", category:"combinations", pt:"Vou comunicar com a sua estação através do Código Internacional de Sinais.", en:"I am going to communicate with your station by means of the International Code of Signals."},
    {id:"ZL", code:"ZL", name:"", category:"combinations", pt:"O seu sinal foi recebido mas não compreendido.", en:"Your signal has been received but not understood."},

    {id:"AN1", code:"AN1", name:"", category:"medical", tags:["medical"], pt:"Preciso de um médico; tenho queimaduras graves.", en:"I need a doctor; I have severe burns.", translated:true},
    {id:"AN2", code:"AN2", name:"", category:"medical", tags:["medical"], pt:"Preciso de um médico; tenho vítimas de radiação.", en:"I need a doctor; I have radiation casualties.", translated:true},
    {id:"MAA", code:"MAA", name:"", category:"medical", tags:["medical"], pt:"Solicito aconselhamento médico urgente.", en:"I request urgent medical advice.", translated:true},
    {id:"MAB", code:"MAB", name:"", category:"medical", tags:["medical"], pt:"Solicito encontro na posição indicada.", en:"I request you to make rendezvous in position indicated.", translated:true},
    {id:"MAC", code:"MAC", name:"", category:"medical", tags:["medical"], pt:"Solicito que providencie admissão hospitalar.", en:"I request you to arrange hospital admission.", translated:true},
    {id:"MAD", code:"MAD", name:"", category:"medical", tags:["medical"], pt:"Estou a ... horas do porto mais próximo.", en:"I am ... hours from the nearest port.", translated:true}
  ];

  const FLAG_SVGS = {
    A: svg(`<polygon points="4,4 92,4 68,50 92,96 4,96" fill="#fff"/><polygon points="4,4 48,4 48,96 4,96" fill="#fff"/><polygon points="48,4 92,4 68,50 92,96 48,96" fill="#1769aa"/>`, "0 0 96 100"),
    B: svg(`<polygon points="4,4 92,4 68,50 92,96 4,96" fill="#d8222a"/>`, "0 0 96 100"),
    C: stripes(["#1769aa","#fff","#d8222a","#fff","#1769aa"], "h"),
    D: stripes(["#f4d21f","#1769aa","#f4d21f"], "h"),
    E: stripes(["#1769aa","#d8222a"], "h"),
    F: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><polygon points="50,18 82,50 50,82 18,50" fill="#d8222a"/>`),
    G: stripes(["#f4d21f","#1769aa","#f4d21f","#1769aa","#f4d21f","#1769aa"], "v"),
    H: stripes(["#fff","#d8222a"], "v"),
    I: svg(`<rect x="4" y="4" width="92" height="92" fill="#f4d21f"/><circle cx="50" cy="50" r="25" fill="#111"/>`),
    J: stripes(["#1769aa","#fff","#1769aa"], "h"),
    K: stripes(["#f4d21f","#1769aa"], "v"),
    L: svg(`<rect x="4" y="4" width="92" height="92" fill="#f4d21f"/><rect x="50" y="4" width="46" height="46" fill="#111"/><rect x="4" y="50" width="46" height="46" fill="#111"/>`),
    M: svg(`<rect x="4" y="4" width="92" height="92" fill="#1769aa"/><polygon points="4,4 16,4 96,84 96,96 84,96 4,16" fill="#fff"/><polygon points="84,4 96,4 96,16 16,96 4,96 4,84" fill="#fff"/>`),
    N: checker("#1769aa","#fff"),
    O: svg(`<polygon points="4,4 96,4 4,96" fill="#f4d21f"/><polygon points="96,4 96,96 4,96" fill="#d8222a"/>`),
    P: svg(`<rect x="4" y="4" width="92" height="92" fill="#1769aa"/><rect x="27" y="27" width="46" height="46" fill="#fff"/>`),
    Q: svg(`<rect x="4" y="4" width="92" height="92" fill="#f4d21f"/>`),
    R: svg(`<rect x="4" y="4" width="92" height="92" fill="#d8222a"/><rect x="41" y="4" width="18" height="92" fill="#f4d21f"/><rect x="4" y="41" width="92" height="18" fill="#f4d21f"/>`),
    S: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><rect x="27" y="27" width="46" height="46" fill="#1769aa"/>`),
    T: stripes(["#d8222a","#fff","#1769aa"], "v"),
    U: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><rect x="4" y="4" width="46" height="46" fill="#d8222a"/><rect x="50" y="50" width="46" height="46" fill="#d8222a"/>`),
    V: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><polygon points="4,4 18,4 96,82 96,96 82,96 4,18" fill="#d8222a"/><polygon points="82,4 96,4 96,18 18,96 4,96 4,82" fill="#d8222a"/>`),
    W: svg(`<rect x="4" y="4" width="92" height="92" fill="#1769aa"/><rect x="20" y="20" width="60" height="60" fill="#fff"/><rect x="34" y="34" width="32" height="32" fill="#d8222a"/>`),
    X: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><rect x="41" y="4" width="18" height="92" fill="#1769aa"/><rect x="4" y="41" width="92" height="18" fill="#1769aa"/>`),
    Y: diagonalStripes(),
    Z: svg(`<rect x="4" y="4" width="92" height="92" fill="#f4d21f"/><polygon points="4,4 50,50 4,96" fill="#111"/><polygon points="96,4 50,50 96,96" fill="#d8222a"/><polygon points="4,96 50,50 96,96" fill="#1769aa"/>`)
  };

  const state = loadState();
  let filter = "all";
  let search = "";
  let filtered = [];
  let currentIndex = 0;
  let examMode = false;
  let examQueue = [];
  let examCurrent = null;
  let examAnswered = false;
  let toastTimer;

  const el = Object.fromEntries([
    "themeToggle","themeIcon","langToggle","langFlag","langLabel","correctStat","wrongStat","accuracyStat","difficultStat",
    "searchInput","clearSearch","filterRow","examToggle","shuffleBtn","modeBadge","resultCount","positionLabel","progressFill",
    "emptyState","studyModeView","examModeView","flashcardWrap","flashcard","cardCategory","cardCategoryBack","difficultyIndicator",
    "flagStage","cardCode","cardName","cardLanguagePill","answerCode","answerMeaning","sourceNote","markWrongBtn","markDifficultBtn",
    "markCorrectBtn","prevBtn","nextBtn","examCategory","examQuestionNumber","examFlag","examKicker","examCode","examName",
    "examOptions","examFeedback","examNextBtn","resetProgressBtn","toast"
  ].map(id => [id, document.getElementById(id)]));

  init();

  function init() {
    applyTheme();
    bindEvents();
    applyFilters();
    updateStats();
    updateLanguageUI();
  }

  function bindEvents() {
    el.themeToggle.addEventListener("click", toggleTheme);
    el.langToggle.addEventListener("click", toggleLanguage);
    el.searchInput.addEventListener("input", e => {
      search = normalize(e.target.value);
      currentIndex = 0;
      applyFilters();
    });
    el.clearSearch.addEventListener("click", () => {
      el.searchInput.value = "";
      search = "";
      currentIndex = 0;
      applyFilters();
      el.searchInput.focus();
    });

    el.filterRow.addEventListener("click", e => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      filter = btn.dataset.filter;
      currentIndex = 0;
      document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === btn));
      applyFilters();
    });

    el.flashcard.addEventListener("click", () => el.flashcard.classList.toggle("is-flipped"));
    el.prevBtn.addEventListener("click", () => moveCard(-1));
    el.nextBtn.addEventListener("click", () => moveCard(1));
    el.markCorrectBtn.addEventListener("click", () => gradeStudy(true));
    el.markWrongBtn.addEventListener("click", () => gradeStudy(false));
    el.markDifficultBtn.addEventListener("click", toggleDifficult);
    el.shuffleBtn.addEventListener("click", shuffleCurrent);
    el.examToggle.addEventListener("click", toggleExam);
    el.examNextBtn.addEventListener("click", nextExamQuestion);
    el.resetProgressBtn.addEventListener("click", resetProgress);

    document.addEventListener("keydown", e => {
      if (["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (examMode) return;
      if (e.key === "ArrowRight") moveCard(1);
      if (e.key === "ArrowLeft") moveCard(-1);
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        el.flashcard.click();
      }
      if (e.key.toLowerCase() === "d") toggleDifficult();
    });
  }

  function applyFilters() {
    filtered = CARDS.filter(card => {
      const tagMatch =
        filter === "all" ||
        (filter === "flags" && card.category === "flags") ||
        (filter === "combinations" && card.category === "combinations") ||
        (filter === "medical" && (card.category === "medical" || card.tags?.includes("medical"))) ||
        (filter === "distress" && card.tags?.includes("distress")) ||
        (filter === "difficult" && state.difficult.includes(card.id)) ||
        (filter === "wrong" && state.wrongCards.includes(card.id));

      if (!tagMatch) return false;
      if (!search) return true;

      const haystack = normalize([card.code, card.name, card.pt, card.en].join(" "));
      return haystack.includes(search);
    });

    if (currentIndex >= filtered.length) currentIndex = Math.max(0, filtered.length - 1);

    if (examMode) startExam();
    else renderStudy();
  }

  function renderStudy() {
    const hasCards = filtered.length > 0;
    el.emptyState.hidden = hasCards;
    el.studyModeView.hidden = !hasCards;
    el.examModeView.hidden = true;

    el.resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "cartão" : "cartões"}`;
    el.positionLabel.textContent = hasCards ? `${currentIndex + 1} / ${filtered.length}` : "0 / 0";
    el.progressFill.style.width = hasCards ? `${((currentIndex + 1) / filtered.length) * 100}%` : "0%";

    if (!hasCards) return;

    const card = filtered[currentIndex];
    const difficult = state.difficult.includes(card.id);

    el.flashcard.classList.remove("is-flipped");
    el.cardCategory.textContent = categoryLabel(card);
    el.cardCategoryBack.textContent = categoryLabel(card);
    el.difficultyIndicator.hidden = !difficult;
    el.flagStage.innerHTML = renderSignal(card.code);
    el.cardCode.textContent = card.code;
    el.cardName.textContent = card.name || categoryLabel(card);
    el.answerCode.textContent = card.name ? `${card.code} • ${card.name}` : card.code;
    el.answerMeaning.textContent = currentMeaning(card);
    el.cardLanguagePill.textContent = state.language === "pt" ? "🇧🇷 PT-BR" : "🇬🇧 English";

    const notes = [];
    if (card.note) notes.push(card.note);
    if (card.translated && state.language === "pt") notes.push("PT-BR: tradução de estudo do texto em inglês apresentado no material-base.");
    el.sourceNote.hidden = notes.length === 0;
    el.sourceNote.textContent = notes.join(" ");

    el.markDifficultBtn.classList.toggle("active", difficult);
    el.markDifficultBtn.textContent = difficult ? "★ Marcado como difícil" : "☆ Marcar difícil";
    el.prevBtn.disabled = filtered.length <= 1;
    el.nextBtn.disabled = filtered.length <= 1;
  }

  function moveCard(delta) {
    if (!filtered.length) return;
    currentIndex = (currentIndex + delta + filtered.length) % filtered.length;
    renderStudy();
  }

  function gradeStudy(correct) {
    if (!filtered.length) return;
    const card = filtered[currentIndex];
    registerAnswer(card.id, correct);
    showToast(correct ? "✓ Acerto registrado" : "↻ Erro salvo para revisão");
    if (!correct) addUnique(state.wrongCards, card.id);
    saveState();
    updateStats();
    if (filter === "wrong" && correct) {
      state.wrongCards = state.wrongCards.filter(id => id !== card.id);
      saveState();
      applyFilters();
      return;
    }
    setTimeout(() => moveCard(1), 130);
  }

  function toggleDifficult() {
    if (!filtered.length) return;
    const id = filtered[currentIndex].id;
    if (state.difficult.includes(id)) {
      state.difficult = state.difficult.filter(x => x !== id);
      showToast("Cartão removido dos difíceis");
    } else {
      state.difficult.push(id);
      showToast("★ Cartão marcado como difícil");
    }
    saveState();
    updateStats();
    if (filter === "difficult") applyFilters();
    else renderStudy();
  }

  function toggleExam() {
    examMode = !examMode;
    el.examToggle.textContent = examMode ? "✕ Encerrar modo prova" : "🎯 Iniciar modo prova";
    el.modeBadge.textContent = examMode ? "MODO PROVA" : "MODO ESTUDO";
    el.shuffleBtn.disabled = examMode;

    if (examMode) startExam();
    else renderStudy();
  }

  function startExam() {
    if (!examMode) return;
    examQueue = shuffle([...filtered.map(c => c.id)]);
    // Prioriza uma revisão já pendente sem duplicar ids.
    const pending = state.wrongCards.filter(id => filtered.some(c => c.id === id));
    examQueue = [...pending, ...examQueue.filter(id => !pending.includes(id))];
    examCurrent = null;
    examAnswered = false;
    el.studyModeView.hidden = true;
    el.emptyState.hidden = examQueue.length > 0;
    el.examModeView.hidden = examQueue.length === 0;
    el.resultCount.textContent = `${examQueue.length} ${examQueue.length === 1 ? "questão" : "questões"}`;
    nextExamQuestion();
  }

  function nextExamQuestion() {
    if (!examMode) return;

    if (examQueue.length === 0) {
      el.examFlag.innerHTML = "";
      el.examCode.textContent = "✓";
      el.examName.textContent = "";
      el.examKicker.textContent = "Revisão concluída";
      el.examOptions.innerHTML = "";
      el.examFeedback.hidden = false;
      el.examFeedback.className = "exam-feedback correct";
      el.examFeedback.textContent = "Você concluiu a fila atual. Os erros continuam salvos no filtro “Errados” até serem acertados.";
      el.examNextBtn.hidden = true;
      el.positionLabel.textContent = "Concluído";
      el.progressFill.style.width = "100%";
      return;
    }

    const id = examQueue.shift();
    examCurrent = CARDS.find(c => c.id === id);
    examAnswered = false;

    const total = filtered.length || 1;
    const done = total - examQueue.length;
    el.examQuestionNumber.textContent = `Questão ${Math.max(1, done)}`;
    el.examCategory.textContent = categoryLabel(examCurrent);
    el.examFlag.innerHTML = renderSignal(examCurrent.code);
    el.examKicker.textContent = state.language === "pt" ? "Qual é o significado deste sinal?" : "What is the meaning of this signal?";
    el.examCode.textContent = examCurrent.code;
    el.examName.textContent = examCurrent.name || "";
    el.examFeedback.hidden = true;
    el.examFeedback.className = "exam-feedback";
    el.examNextBtn.hidden = true;

    const choices = buildChoices(examCurrent);
    el.examOptions.innerHTML = "";
    choices.forEach(card => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.dataset.id = card.id;
      btn.textContent = currentMeaning(card);
      btn.addEventListener("click", () => answerExam(btn, card.id));
      el.examOptions.appendChild(btn);
    });

    const completed = Math.max(0, total - examQueue.length - 1);
    el.positionLabel.textContent = `${Math.min(total, completed + 1)} / ${total}`;
    el.progressFill.style.width = `${Math.min(100, ((completed + 1) / total) * 100)}%`;
  }

  function answerExam(button, chosenId) {
    if (examAnswered || !examCurrent) return;
    examAnswered = true;

    const isCorrect = chosenId === examCurrent.id;
    registerAnswer(examCurrent.id, isCorrect);

    const optionButtons = [...el.examOptions.querySelectorAll(".option-btn")];
    optionButtons.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.id === examCurrent.id) btn.classList.add("correct");
      else if (btn === button && !isCorrect) btn.classList.add("wrong");
    });

    if (isCorrect) {
      state.wrongCards = state.wrongCards.filter(id => id !== examCurrent.id);
      el.examFeedback.className = "exam-feedback correct";
      el.examFeedback.textContent = state.language === "pt" ? "Correto." : "Correct.";
    } else {
      addUnique(state.wrongCards, examCurrent.id);
      // Repetição espaçada dentro da própria prova: o erro volta ao fim da fila.
      examQueue.push(examCurrent.id);
      el.examFeedback.className = "exam-feedback wrong";
      el.examFeedback.textContent = state.language === "pt"
        ? `Incorreto. Resposta: ${examCurrent.pt}`
        : `Incorrect. Answer: ${examCurrent.en}`;
    }

    el.examFeedback.hidden = false;
    el.examNextBtn.hidden = false;
    saveState();
    updateStats();
  }

  function buildChoices(correctCard) {
    let pool = filtered.filter(c => c.id !== correctCard.id);
    if (pool.length < 3) pool = CARDS.filter(c => c.id !== correctCard.id);
    const distractors = shuffle(pool).slice(0, 3);
    return shuffle([correctCard, ...distractors]);
  }

  function shuffleCurrent() {
    if (filtered.length < 2) return;
    const ids = shuffle(filtered.map(c => c.id));
    const rank = new Map(ids.map((id, i) => [id, i]));
    filtered.sort((a, b) => rank.get(a.id) - rank.get(b.id));
    currentIndex = 0;
    renderStudy();
    showToast("Cartões embaralhados");
  }

  function registerAnswer(id, correct) {
    state.stats.answered += 1;
    if (correct) {
      state.stats.correct += 1;
      state.wrongCards = state.wrongCards.filter(x => x !== id);
    } else {
      state.stats.wrong += 1;
      addUnique(state.wrongCards, id);
    }
    state.cardStats[id] ||= {correct:0, wrong:0};
    state.cardStats[id][correct ? "correct" : "wrong"] += 1;
    saveState();
  }

  function updateStats() {
    el.correctStat.textContent = state.stats.correct;
    el.wrongStat.textContent = state.stats.wrong;
    el.difficultStat.textContent = state.difficult.length;
    el.accuracyStat.textContent = state.stats.answered
      ? `${Math.round((state.stats.correct / state.stats.answered) * 100)}%`
      : "—";
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
    saveState();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    el.themeIcon.textContent = state.theme === "dark" ? "☀️" : "🌙";
    el.themeToggle.title = state.theme === "dark" ? "Modo claro" : "Modo escuro";
  }

  function toggleLanguage() {
    state.language = state.language === "pt" ? "en" : "pt";
    saveState();
    updateLanguageUI();
    if (examMode) startExam();
    else renderStudy();
  }

  function updateLanguageUI() {
    const pt = state.language === "pt";
    el.langFlag.textContent = pt ? "🇧🇷" : "🇬🇧";
    el.langLabel.textContent = pt ? "PT-BR" : "English";
  }

  function resetProgress() {
    const ok = window.confirm("Apagar acertos, erros, cartões difíceis e fila de revisão? Tema e idioma também voltarão ao padrão.");
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(state, defaultState());
    filter = "all";
    search = "";
    currentIndex = 0;
    examMode = false;
    el.searchInput.value = "";
    document.querySelectorAll(".filter-chip").forEach((chip, i) => chip.classList.toggle("active", i === 0));
    el.examToggle.textContent = "🎯 Iniciar modo prova";
    el.modeBadge.textContent = "MODO ESTUDO";
    el.shuffleBtn.disabled = false;
    applyTheme();
    updateLanguageUI();
    updateStats();
    applyFilters();
    showToast("Progresso resetado");
  }

  function currentMeaning(card) {
    return state.language === "pt" ? card.pt : card.en;
  }

  function categoryLabel(card) {
    if (card.category === "flags") return state.language === "pt" ? "Bandeira" : "Flag";
    if (card.category === "medical") return state.language === "pt" ? "Médico" : "Medical";
    if (card.tags?.includes("distress")) return "Distress";
    return state.language === "pt" ? "Combinação" : "Combination";
  }

  function renderSignal(code) {
    const chars = code.replace(/\s/g, "").split("");
    const flags = chars.filter(ch => /[A-Z]/.test(ch));
    const numerals = chars.filter(ch => /\d/.test(ch));

    if (flags.length === 1 && numerals.length === 0) return FLAG_SVGS[flags[0]] || "";
    const parts = [
      ...flags.map(ch => FLAG_SVGS[ch]),
      ...numerals.map(ch => numeralSvg(ch))
    ].filter(Boolean);
    return `<div class="signal-group">${parts.join("")}</div>`;
  }

  function svg(content, viewBox="0 0 100 100") {
    return `<svg class="signal-svg" viewBox="${viewBox}" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="96" height="96" rx="1" fill="#fff" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
      ${content}
    </svg>`;
  }

  function stripes(colors, direction) {
    const n = colors.length;
    const chunks = colors.map((color, i) => {
      if (direction === "h") {
        const h = 92 / n;
        return `<rect x="4" y="${4 + i*h}" width="92" height="${h + .4}" fill="${color}"/>`;
      }
      const w = 92 / n;
      return `<rect x="${4 + i*w}" y="4" width="${w + .4}" height="92" fill="${color}"/>`;
    }).join("");
    return svg(chunks);
  }

  function checker(a,b) {
    return svg(`
      <rect x="4" y="4" width="46" height="46" fill="${a}"/>
      <rect x="50" y="4" width="46" height="46" fill="${b}"/>
      <rect x="4" y="50" width="46" height="46" fill="${b}"/>
      <rect x="50" y="50" width="46" height="46" fill="${a}"/>
    `);
  }

  function diagonalStripes() {
    return svg(`
      <defs><clipPath id="yclip"><rect x="4" y="4" width="92" height="92"/></clipPath></defs>
      <g clip-path="url(#yclip)" transform="rotate(-45 50 50)">
        <rect x="-30" y="-30" width="160" height="160" fill="#f4d21f"/>
        <rect x="-30" y="-30" width="160" height="14" fill="#d8222a"/>
        <rect x="-30" y="-2" width="160" height="14" fill="#d8222a"/>
        <rect x="-30" y="26" width="160" height="14" fill="#d8222a"/>
        <rect x="-30" y="54" width="160" height="14" fill="#d8222a"/>
        <rect x="-30" y="82" width="160" height="14" fill="#d8222a"/>
        <rect x="-30" y="110" width="160" height="14" fill="#d8222a"/>
      </g>
    `);
  }

  function numeralSvg(n) {
    const shape = {
      "0": `<rect x="4" y="4" width="92" height="30.7" fill="#f4d21f"/><rect x="4" y="34.7" width="92" height="30.6" fill="#d8222a"/><rect x="4" y="65.3" width="92" height="30.7" fill="#f4d21f"/>`,
      "1": `<rect x="4" y="4" width="92" height="92" fill="#fff"/><circle cx="50" cy="50" r="25" fill="#d8222a"/>`,
      "2": `<rect x="4" y="4" width="92" height="92" fill="#1769aa"/><circle cx="50" cy="50" r="25" fill="#fff"/>`,
      "3": `<rect x="4" y="4" width="92" height="30.7" fill="#d8222a"/><rect x="4" y="34.7" width="92" height="30.6" fill="#fff"/><rect x="4" y="65.3" width="92" height="30.7" fill="#1769aa"/>`,
      "4": `<rect x="4" y="4" width="92" height="92" fill="#d8222a"/><rect x="42" y="4" width="16" height="92" fill="#fff"/><rect x="4" y="42" width="92" height="16" fill="#fff"/>`,
      "5": `<rect x="4" y="4" width="92" height="46" fill="#f4d21f"/><rect x="4" y="50" width="92" height="46" fill="#1769aa"/>`,
      "6": `<rect x="4" y="4" width="92" height="46" fill="#111"/><rect x="4" y="50" width="92" height="46" fill="#fff"/>`,
      "7": `<rect x="4" y="4" width="92" height="46" fill="#f4d21f"/><rect x="4" y="50" width="92" height="46" fill="#d8222a"/>`,
      "8": `<rect x="4" y="4" width="92" height="92" fill="#fff"/><rect x="42" y="4" width="16" height="92" fill="#d8222a"/><rect x="4" y="42" width="92" height="16" fill="#d8222a"/>`,
      "9": `<rect x="4" y="4" width="46" height="46" fill="#fff"/><rect x="50" y="4" width="46" height="46" fill="#d8222a"/><rect x="4" y="50" width="46" height="46" fill="#111"/><rect x="50" y="50" width="46" height="46" fill="#f4d21f"/>`
    }[n];
    return shape ? svg(shape) : "";
  }

  function defaultState() {
    return {
      theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      language: "pt",
      difficult: [],
      wrongCards: [],
      stats: {answered:0, correct:0, wrong:0},
      cardStats: {}
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const base = defaultState();
      if (!saved || typeof saved !== "object") return base;
      return {
        ...base,
        ...saved,
        stats: {...base.stats, ...(saved.stats || {})},
        cardStats: saved.cardStats || {},
        difficult: Array.isArray(saved.difficult) ? saved.difficult : [],
        wrongCards: Array.isArray(saved.wrongCards) ? saved.wrongCards : []
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // O app continua funcional mesmo se o armazenamento estiver indisponível.
    }
  }

  function addUnique(arr, value) {
    if (!arr.includes(value)) arr.push(value);
  }

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim();
  }

  function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    el.toast.textContent = message;
    el.toast.classList.add("show");
    toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1700);
  }
})();
