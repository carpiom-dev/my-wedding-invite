import { Provider } from '@angular/core';
import { InMemoryPersonRepository } from '@infrastructure/repositories/in-memory-person.repository';
import { ListPersons } from '@application/use-cases/list-persons.usecase';
import { GetPerson } from '@application/use-cases/get-person.usecase';
import { AddPerson } from '@application/use-cases/add-person.usecase';
import { UpdatePerson } from '@application/use-cases/update-person.usecase';
import { RemovePerson } from '@application/use-cases/remove-person.usecase';
import {
  LIST_PERSONS,
  GET_PERSON,
  ADD_PERSON,
  UPDATE_PERSON,
  REMOVE_PERSON,
} from './injection-tokens';

export const APP_PROVIDERS: Provider[] = [
  InMemoryPersonRepository,

  {
    provide: LIST_PERSONS,
    deps: [InMemoryPersonRepository],
    useFactory: (repo: InMemoryPersonRepository) => new ListPersons(repo),
  },
  {
    provide: GET_PERSON,
    deps: [InMemoryPersonRepository],
    useFactory: (repo: InMemoryPersonRepository) => new GetPerson(repo),
  },
  {
    provide: ADD_PERSON,
    deps: [InMemoryPersonRepository],
    useFactory: (repo: InMemoryPersonRepository) => new AddPerson(repo),
  },
  {
    provide: UPDATE_PERSON,
    deps: [InMemoryPersonRepository],
    useFactory: (repo: InMemoryPersonRepository) => new UpdatePerson(repo),
  },
  {
    provide: REMOVE_PERSON,
    deps: [InMemoryPersonRepository],
    useFactory: (repo: InMemoryPersonRepository) => new RemovePerson(repo),
  },
];
