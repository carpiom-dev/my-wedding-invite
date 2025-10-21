import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@presentation/material.module';
import { ConfirmPerson } from '@application/use-cases/confirm-person.usecase';
import { LIST_PERSONS } from '@infrastructure/di/injection-tokens';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-invite',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './confirm-invite.component.html',
  styleUrls: ['./confirm-invite.component.scss']
})
export class ConfirmInviteComponent implements OnInit {
  private confirmPerson = inject(ConfirmPerson);
  private listPersons = inject(LIST_PERSONS);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  nombre = '';
  confirmado = false;
  personId?: string;

  async ngOnInit() {
    this.personId = this.route.snapshot.queryParamMap.get('id') || undefined;
    if (!this.personId) {
      this.snack.open('Invitación inválida', 'Cerrar', { duration: 3000 });
      return;
    }

    const persons = await this.listPersons.execute();
    const person = persons.find(p => p.id.value === this.personId);
    if (!person) {
      this.snack.open('Invitado no encontrado', 'Cerrar', { duration: 3000 });
      return;
    }

    this.nombre = person.nombre;
    this.confirmado = person.confirmado ?? false;
  }

  async confirmar() {
    if (!this.personId) return;
    await this.confirmPerson.execute({ value: this.personId });
    this.confirmado = true;
    this.snack.open('Gracias por confirmar tu asistencia 🎉', 'Cerrar', { duration: 3000 });
  }
}
