import { InjectionToken } from '@angular/core';
import { ListPersons } from '@application/use-cases/list-persons.usecase';
import { GetPerson } from '@application/use-cases/get-person.usecase';
import { AddPerson } from '@application/use-cases/add-person.usecase';
import { UpdatePerson } from '@application/use-cases/update-person.usecase';
import { RemovePerson } from '@application/use-cases/remove-person.usecase';

export const LIST_PERSONS = new InjectionToken<ListPersons>('LIST_PERSONS');
export const GET_PERSON = new InjectionToken<GetPerson>('GET_PERSON');
export const ADD_PERSON = new InjectionToken<AddPerson>('ADD_PERSON');
export const UPDATE_PERSON = new InjectionToken<UpdatePerson>('UPDATE_PERSON');
export const REMOVE_PERSON = new InjectionToken<RemovePerson>('REMOVE_PERSON');
