import { Person, PersonId } from '../entities/person';

export interface PersonRepository {
  list(): Promise<Person[]>;
  getById(id: PersonId): Promise<Person | null>;
  add(person: Omit<Person, 'id'>): Promise<Person>;
  update(id: PersonId, patch: Partial<Omit<Person, 'id'>>): Promise<void>;
  remove(id: PersonId): Promise<void>;
}
