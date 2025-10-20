import { Person, PersonId } from '@domain/entities/person';
import { PersonRepository } from '@domain/repositories/person.repository';

export class GetPerson {
  constructor(private readonly repo: PersonRepository) {}

  async execute(id: PersonId): Promise<Person | null> {
    return this.repo.getById(id);
  }
}
