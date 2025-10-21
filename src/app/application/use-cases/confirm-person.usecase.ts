import { Injectable, inject } from '@angular/core';
import { PersonId } from '@domain/entities/person';
import { UPDATE_PERSON } from '@infrastructure/di/injection-tokens';
import { UpdatePerson } from '@application/use-cases/update-person.usecase';

@Injectable({ providedIn: 'root' })
export class ConfirmPerson {
  private readonly repo = inject(UPDATE_PERSON) as UpdatePerson;

  async execute(id: PersonId): Promise<void> {
    await this.repo.execute(id, {
      confirmado: true,
      fechaConfirmacion: new Date().toISOString()
    });
  }
}
