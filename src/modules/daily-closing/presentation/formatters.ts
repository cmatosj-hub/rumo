export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  }).format(cents / 100);
}

export function formatOperationalDate(operationalDate: string): string {
  const [year, month, day] = operationalDate.split('-');
  return `${day}/${month}/${year}`;
}

export function formatDistance(meters: number): string {
  return `${new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(meters / 1000)} km`;
}

export function formatWorkedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${String(hours)}h ${String(minutes).padStart(2, '0')}min`;
}

export function currentLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${String(year)}-${month}-${day}`;
}

export function parseDecimalToScaledInteger(
  rawValue: string,
  maximumDecimalPlaces: number,
  scale: number,
): number | null {
  const normalized = rawValue.trim().replace(',', '.');
  const pattern = new RegExp(
    `^\\d+(?:\\.\\d{0,${String(maximumDecimalPlaces)}})?$`,
  );

  if (!pattern.test(normalized)) {
    return null;
  }

  const [wholePart = '', decimalPart = ''] = normalized.split('.');
  const denominator = 10 ** decimalPart.length;
  const fraction = decimalPart.length === 0 ? 0 : Number(decimalPart);
  const scaledFraction = (fraction * scale) / denominator;
  const result = Number(wholePart) * scale + scaledFraction;

  return Number.isSafeInteger(result) ? result : null;
}

export function normalizeMoneyInput(rawValue: string): string {
  const cents = parseDecimalToScaledInteger(rawValue, 2, 100);
  if (cents === null) {
    return rawValue;
  }
  return (cents / 100).toFixed(2).replace('.', ',');
}
