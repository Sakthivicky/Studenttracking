export function calculateTotal(row: {
  grammar: number;
  vocabulary: number;
  pronunciation: number;
  fluency: number;
  confidence: number;
}) {
  return (
    row.grammar +
    row.vocabulary +
    row.pronunciation +
    row.fluency +
    row.confidence
  );
}

export function performance(total: number) {
  if (total >= 90) return "Excellent";
  if (total >= 75) return "Good";
  if (total >= 60) return "Average";
  return "Needs Improvement";
}

export function wpmRating(wpm: number) {
  if (wpm >= 120) return "Fast";
  if (wpm >= 100) return "Normal";
  return "Slow";
}