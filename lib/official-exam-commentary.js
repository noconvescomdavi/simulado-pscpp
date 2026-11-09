import verifiedBlock001 from "../data/pscpp/official-exam-commentaries/block-001.json";

const verified = new Map(
  verifiedBlock001.questions
    .filter((item) => item.verification_status === "bibliography_verified")
    .map((item) => [String(item.id), item])
);

/**
 * Only expose commentary that has been source-verified.
 * Missing commentary must never be synthesized from the answer key.
 */
export function getOfficialExamCommentary(questionId, selectedAnswer) {
  const entry = verified.get(String(questionId));
  if (!entry) return null;
  const selected = String(selectedAnswer || "").trim().toUpperCase();
  return {
    correct_answer: entry.correct_answer,
    correct_reason: entry.correct_reason,
    incorrect_reason: selected !== entry.correct_answer
      ? entry.incorrect_reasons?.[selected] || null
      : null,
    bibliography: entry.bibliography || [],
  };
}
