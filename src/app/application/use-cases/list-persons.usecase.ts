import { Person } from '@domain/entities/person';
import { PersonRepository } from '@domain/repositories/person.repository';

export class ListPersons {
  constructor(private readonly repo: PersonRepository) {}

  async execute(): Promise<Person[]> {
    return this.repo.list();
  }
}
