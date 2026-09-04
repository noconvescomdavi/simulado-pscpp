import { notFound, redirect } from "next/navigation";
import { getSession } from "../../../lib/auth";
import { getEntitlement } from "../../../lib/entitlement";
import { getFlashcardDeck, getFlashcardState } from "../../../lib/flashcards";
import StudentHeader from "../../components/StudentHeader";
import FlashcardsClient from "./FlashcardsClient";

export async function generateMetadata({ params }) {
  const { deck: slug } = await params;
  try {
    const deck = await getFlashcardDeck(slug);
    return { title: deck ? `Flashcards â€” ${deck.title}` : "Flashcards" };
  } catch {
    return { title: "Flashcards" };
  }
}

export default async function FlashcardDeckPage({ params }) {
  const { deck: slug } = await params;
  const session = await getSession();
  if (!session) redirect(`/login?next=/flashcards/${encodeURIComponent(slug)}`);

  const entitlement = await getEntitlement(session.id);
  const trialAllowed = entitlement.trial && String(slug).toLowerCase() === "cis";

  if (!entitlement.active && !trialAllowed) {
    redirect("/comprar?locked=inactive");
  }

  const deck = await getFlashcardDeck(slug);
  if (!deck) notFound();

  const state = await getFlashcardState(session.id, deck.id);

  return (
    <>
      <StudentHeader active="flashcards" />
      <FlashcardsClient
        deck={{
          slug: deck.slug,
          title: deck.title,
          subjectLabel: deck.subject_label,
          description: deck.description,
          cards: deck.cards,
        }}
        initialState={state}
      />
    </>
  );
}