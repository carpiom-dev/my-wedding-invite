import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Person } from '@domain/entities/person';
import { buildInviteText } from '@application/utils/invite-template';
import { UPDATE_PERSON } from '@infrastructure/di/injection-tokens';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private update = inject(UPDATE_PERSON);
  private snack = inject(MatSnackBar);

  buildMessage(person: Person): string {
    const url = `https://mi-boda.com/confirm?id=${person.id.value}`;
    const message = buildInviteText(person);
    return `${message} \n\nPor favor confirma tu asistencia aquí: ${url}`;
  }

  buildUrl(person: Person): string {
    const message = encodeURIComponent(this.buildMessage(person));
    const phone = String(person.telefono ?? '').replace(/\D/g, '');

    if (!/^593\d{9}$/.test(phone)) return '';

    return `https://wa.me/${phone}?text=${message}`;
  }

  async openIndividual(person: Person): Promise<void> {
    const phone = String(person.telefono ?? '').replace(/\D/g, '');
    if (!/^593\d{9}$/.test(phone)) {
      this.snack.open(
        `⚠️ Número inválido para ${person.nombre ?? 'Invitado'}`,
        'Cerrar',
        { duration: 3500, panelClass: ['snack-warn'] }
      );
      return;
    }

    window.open(this.buildUrl(person), '_blank');

    if (!person.enviado) await this.update.execute(person.id, { enviado: true });

    this.snack.open(`📤 Mensaje preparado para ${person.nombre}`, 'Cerrar', {
      duration: 2500,
      panelClass: ['snack-success']
    });
  }

  async openBulk(persons: Person[]): Promise<void> {
    const valid = persons.filter(p =>
      /^593\d{9}$/.test(String(p.telefono ?? '').replace(/\D/g, ''))
    );
    const invalid = persons.filter(p =>
      !/^593\d{9}$/.test(String(p.telefono ?? '').replace(/\D/g, ''))
    );

    if (invalid.length) {
      this.snack.open(
        `⚠️ ${invalid.length} invitado(s) tienen número inválido.`,
        'Cerrar',
        { duration: 3500, panelClass: ['snack-warn'] }
      );
    }

    for (const p of valid) {
      window.open(this.buildUrl(p), '_blank');
      if (!p.enviado) await this.update.execute(p.id, { enviado: true });
    }

    if (valid.length)
      this.snack.open(`✅ Enviado a ${valid.length} invitado(s).`, 'Cerrar', {
        duration: 3000,
        panelClass: ['snack-success']
      });
  }
}
