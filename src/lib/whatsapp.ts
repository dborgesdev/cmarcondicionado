export const SITE = "https://cmarcondicionado.com.br";
export const GENERAL_MESSAGE =
  "Olá! Conheci a CM Ar-Condicionado pelo site e gostaria de solicitar atendimento.";
export function whatsapp(message = GENERAL_MESSAGE) {
  return `https://wa.me/5562993528692?text=${encodeURIComponent(message)}`;
}
export function pieceMessage(piece: {
  name: string;
  code: string;
  slug: string;
  availability: string;
}) {
  return `Olá! Vi a peça "${piece.name}"${piece.code ? ` (código: ${piece.code})` : ""} no site da CM Ar-Condicionado e gostaria de ${piece.availability === "indisponivel" ? "consultar uma alternativa" : "consultar disponibilidade e condições"}. Link: ${SITE}/pecas/${piece.slug}`;
}
export function workMessage(work: { name: string; slug: string }) {
  return `Olá! Vi o trabalho "${work.name}" no site da CM Ar-Condicionado e gostaria de conversar sobre um serviço semelhante. Link: ${SITE}/trabalhos/${work.slug}`;
}
