export class Phone {
  private constructor(public readonly value: string) {}

  static tryCreate(raw?: string | null): Phone | null {
    if (!raw) return null;
    const cleaned = raw.replace(/\s+/g, '');
    if (!/^\d{7,15}$/.test(cleaned)) {
      throw new Error('Teléfono inválido. Usa solo dígitos con código de país.');
    }
    return new Phone(cleaned);
  }
}
