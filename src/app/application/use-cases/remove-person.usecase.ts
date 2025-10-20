import { PersonId } from '@domain/entities/person';
import { PersonRepository } from '@domain/repositories/person.repository';

export class RemovePerson {
  constructor(private readonly repo: PersonRepository) {}

  async execute(id: PersonId): Promise<void> {
    await this.repo.remove(id);
  }
}
