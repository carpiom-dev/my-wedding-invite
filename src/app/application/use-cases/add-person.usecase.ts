import { Person } from '@domain/entities/person';
import { PersonRepository } from '@domain/repositories/person.repository';
import { Phone } from '@domain/value-objects/phone';

export interface AddPersonInput {
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;
  nota?: string | null;
}

export class AddPerson {
  constructor(private readonly repo: PersonRepository) {}

  async execute(input: AddPersonInput): Promise<Person> {
    if (!input.nombre?.trim()) {
      throw new Error('El nombre es obligatorio');
    }

    const telefono = input.telefono ? Phone.tryCreate(input.telefono)?.value ?? null : null;

    return this.repo.add({
      nombre: input.nombre.trim(),
      apellido: input.apellido?.trim() || null,
      telefono,
      nota: input.nota?.trim() || null,
      enviado: false,
    });
  }
}
