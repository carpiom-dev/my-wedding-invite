import { PersonId } from '@domain/entities/person';
import { PersonRepository } from '@domain/repositories/person.repository';
import { Phone } from '@domain/value-objects/phone';

export interface UpdatePersonInput {
  nombre?: string;
  apellido?: string | null;
  telefono?: string | null;
  nota?: string | null;
  enviado?: boolean;
  confirmado?: boolean;           // agregado
  fechaConfirmacion?: string;     // agregado
}

export class UpdatePerson {
  constructor(private readonly repo: PersonRepository) {}

  async execute(id: PersonId, patch: UpdatePersonInput): Promise<void> {
    const safePatch: UpdatePersonInput = { ...patch };

    if (typeof safePatch.nombre === 'string') {
      safePatch.nombre = safePatch.nombre.trim();
      if (!safePatch.nombre) throw new Error('El nombre no puede estar vacío');
    }

    if (typeof safePatch.telefono === 'string') {
      safePatch.telefono = Phone.tryCreate(safePatch.telefono)?.value ?? null;
    }

    await this.repo.update(id, safePatch);
  }
}
