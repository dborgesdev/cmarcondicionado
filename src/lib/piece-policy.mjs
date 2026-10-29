// ID 29 was explicitly confirmed by the owner as a real commercial piece on 2026-10-29.
// Keep the exception narrow; other test references remain excluded.
export function isPublicPiece(post) {
  if (post.id === 29) return true;
  return !/^TESTE-CM-/i.test(String(post.acf?.codigo_referencia ?? "").trim());
}
