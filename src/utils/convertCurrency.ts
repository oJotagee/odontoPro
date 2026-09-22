/**
 * Converte um valor em reais (formato string) para centavos (número inteiro).
 * @param amount - Valor em reais no formato string (ex: "1.234,56").
 * @returns Valor em centavos.
 */
export function convertRealToCents(amount: string) {
  const numericValue = parseFloat(amount.replace(/\./g, "").replace(",", "."));
  const priceInCents = Math.round(numericValue * 100);

  return priceInCents;
}

export function convertCentsToReal(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}