export function toUtcString(date: string) {
  return new Date(date).toISOString();
}
