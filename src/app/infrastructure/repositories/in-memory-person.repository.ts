import { Injectable, computed, signal } from '@angular/core';
import { Person, PersonId } from '@domain/entities/person';
import { PersonRepository } from '@domain/repositories/person.repository';
import { createId } from '@domain/value-objects/id';

@Injectable({ providedIn: 'root' })
export class InMemoryPersonRepository implements PersonRepository {
  // Estado local reactivo
  private readonly _data = signal<Person[]>([
    {
      id: { value: createId() },
      nombre: 'María',
      apellido: 'García',
      telefono: '593999000111',
      nota: 'Mesa 3',
      enviado: false,
    },
    {
      id: { value: createId() },
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '593999000222',
      nota: 'Vegetariano',
      enviado: true,
    },
  ]);

  persons = computed(() => this._data());

  async list(): Promise<Person[]> {
    return this._data();
  }

  async getById(id: PersonId): Promise<Person | null> {
    return this._data().find(p => p.id.value === id.value) ?? null;
  }

  async add(person: Omit<Person, 'id'>): Promise<Person> {
    const newPerson: Person = { ...person, id: { value: createId() } };
    this._data.update(list => [newPerson, ...list]);
    return newPerson;
  }

  async update(id: PersonId, patch: Partial<Omit<Person, 'id'>>): Promise<void> {
    this._data.update(list =>
      list.map(p => (p.id.value === id.value ? { ...p, ...patch } : p))
    );
  }

  async remove(id: PersonId): Promise<void> {
    this._data.update(list => list.filter(p => p.id.value !== id.value));
  }
}
