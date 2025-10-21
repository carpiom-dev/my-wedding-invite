import { Provider } from '@angular/core';
import { AddPerson } from '@application/use-cases/add-person.usecase';
import { ListPersons } from '@application/use-cases/list-persons.usecase';
import { UpdatePerson } from '@application/use-cases/update-person.usecase';
import { RemovePerson } from '@application/use-cases/remove-person.usecase';
import { ADD_PERSON, LIST_PERSONS, UPDATE_PERSON, REMOVE_PERSON } from './injection-tokens';
import { PersonFirestoreRepository } from '@infrastructure/repositories/person-firestore.repository';

export const APP_PROVIDERS: Provider[] = [
  {
    provide: ADD_PERSON,
    useFactory: (repo: PersonFirestoreRepository) => new AddPerson(repo),
    deps: [PersonFirestoreRepository]
  },
  {
    provide: LIST_PERSONS,
    useFactory: (repo: PersonFirestoreRepository) => new ListPersons(repo),
    deps: [PersonFirestoreRepository]
  },
  {
    provide: UPDATE_PERSON,
    useFactory: (repo: PersonFirestoreRepository) => new UpdatePerson(repo),
    deps: [PersonFirestoreRepository]
  },
  {
    provide: REMOVE_PERSON,
    useFactory: (repo: PersonFirestoreRepository) => new RemovePerson(repo),
    deps: [PersonFirestoreRepository]
  },
];
