import { Injectable, inject } from '@angular/core';
import { Person } from '@domain/entities/person';
import { buildInviteText } from '@application/utils/invite-template';
import { UPDATE_PERSON } from '@infrastructure/di/injection-tokens';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private waBase = 'https://wa.me/?text=';
  private update = inject(UPDATE_PERSON);

  buildMessage(person: Person): string {
    return buildInviteText(person);
  }

  buildUrl(person: Person): string {
    const text = this.buildMessage(person);
    return `${this.waBase}${encodeURIComponent(text)}`;
  }

  async openIndividual(person: Person): Promise<void> {
    const url = this.buildUrl(person);
    window.open(url, '_blank');

    // marcar como enviado
    if (!person.enviado) {
      await this.update.execute(person.id, { enviado: true });
    }
  }

  async openBulk(persons: Person[]): Promise<void> {
    for (const p of persons) {
      const url = this.buildUrl(p);
      window.open(url, '_blank');

      if (!p.enviado) {
        await this.update.execute(p.id, { enviado: true });
      }
    }
  }
}
