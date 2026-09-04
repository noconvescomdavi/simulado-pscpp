import { getSession } from "../../../../lib/auth";
import { getEntitlement } from "../../../../lib/entitlement";
import {
  finishFlashcardSession,
  getFlashcardDeck,
  getFlashcardState,
  recordFlashcardAnswer,
  resetFlashcardDeckProgress,
  setFlashcardDifficult,
  startFlashcardSession,
} from "../../../../lib/flashcards";

async function context(params) {
  const session = await getSession();
  if (!session?.id) {
    return { response: Response.json({ error: "Não autenticado." }, { status: 401 }) };
  }

  const { deck: slug } = await params;
  const entitlement = await getEntitlement(session.id);
  const trialAllowed = entitlement.trial && String(slug).toLowerCase() === "cis";

  if (!entitlement.active && !trialAllowed) {
    return { response: Response.json({ error: "Acesso nÃ£o liberado." }, { status: 403 }) };
  }

  const deck = await getFlashcardDeck(slug);

  if (!deck) {
    return { response: Response.json({ error: "Baralho não encontrado." }, { status: 404 }) };
  }

  return { session, deck };
}

function hasCard(deck, cardKey) {
  return deck.cards.some((card) => String(card.id) === String(cardKey));
}

export async function GET(_request, { params }) {
  try {
    const ctx = await context(params);
    if (ctx.response) return ctx.response;

    const state = await getFlashcardState(ctx.session.id, ctx.deck.id);
    return Response.json({ deck: ctx.deck, state });
  } catch (error) {
    console.error("flashcards GET", error);
    return Response.json(
      { error: "Não foi possível carregar os flashcards." },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const ctx = await context(params);
    if (ctx.response) return ctx.response;

    const body = await request.json().catch(() => ({}));
    const action = String(body.action || "");

    if (action === "session_start") {
      const session = await startFlashcardSession(
        ctx.session.id,
        ctx.deck.id,
        body.mode === "exam" ? "exam" : "study"
      );
      return Response.json({ ok: true, session });
    }

    if (action === "session_finish") {
      const session = await finishFlashcardSession(
        ctx.session.id,
        ctx.deck.id,
        body.sessionId,
        body.status
      );
      return Response.json({ ok: true, session });
    }

    if (action === "answer") {
      const cardKey = String(body.cardKey || "");
      if (!hasCard(ctx.deck, cardKey)) {
        return Response.json({ error: "Cartão inválido." }, { status: 400 });
      }

      if (typeof body.correct !== "boolean") {
        return Response.json({ error: "Resultado inválido." }, { status: 400 });
      }

      await recordFlashcardAnswer({
        userId: ctx.session.id,
        deckId: ctx.deck.id,
        cardKey,
        correct: body.correct,
        responseTimeMs: body.responseTimeMs,
        sessionId: body.sessionId || null,
      });

      const state = await getFlashcardState(ctx.session.id, ctx.deck.id);
      return Response.json({ ok: true, state });
    }

    if (action === "difficulty") {
      const cardKey = String(body.cardKey || "");
      if (!hasCard(ctx.deck, cardKey)) {
        return Response.json({ error: "Cartão inválido." }, { status: 400 });
      }

      await setFlashcardDifficult(
        ctx.session.id,
        ctx.deck.id,
        cardKey,
        body.difficult === true
      );

      const state = await getFlashcardState(ctx.session.id, ctx.deck.id);
      return Response.json({ ok: true, state });
    }

    if (action === "reset") {
      await resetFlashcardDeckProgress(ctx.session.id, ctx.deck.id);
      return Response.json({
        ok: true,
        state: {
          metrics: {
            answered: 0,
            correct: 0,
            wrong: 0,
            difficult: 0,
            studied_cards: 0,
            accuracy: 0,
          },
          progress: [],
        },
      });
    }

    return Response.json({ error: "Ação inválida." }, { status: 400 });
  } catch (error) {
    console.error("flashcards POST", error);
    return Response.json(
      { error: "Não foi possível salvar o progresso dos flashcards." },
      { status: 500 }
    );
  }
}
