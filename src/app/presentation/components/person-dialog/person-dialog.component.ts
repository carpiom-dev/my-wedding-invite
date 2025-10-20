import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '@presentation/material.module';
import { Person } from '@domain/entities/person';
import { ADD_PERSON, UPDATE_PERSON } from '@infrastructure/di/injection-tokens';

@Component({
  selector: 'app-person-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})
export class PersonDialogComponent {
  private add = inject(ADD_PERSON);
  private update = inject(UPDATE_PERSON);
  private snack = inject(MatSnackBar);

  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<PersonDialogComponent>);

  person: Person = this.data?.person
    ? { ...this.data.person }
    : { nombre: '', apellido: '', telefono: '', nota: '', enviado: false };

  ngOnInit() {
    this.onPhoneBlur(); // autocorregir teléfono si ya viene cargado
  }

  onPhoneBlur() {
    if (!this.person.telefono) return;
    let tel = this.person.telefono.trim().replace(/\D/g, '');
    if (tel.startsWith('0') && tel.length === 10) {
      tel = `593${tel.substring(1)}`;
    } else if (!tel.startsWith('593')) {
      tel = `593${tel}`;
    }
    this.person.telefono = tel;
  }

  isPhoneValid(phone?: string | null): boolean {
    const tel = (phone || '').trim().replace(/\D/g, '');
    return /^593\d{9}$/.test(tel);
  }

  async save() {
    if (!this.isPhoneValid(this.person.telefono)) {
      this.snack.open('Número de teléfono inválido. Ej: 593999000111', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    try {
      if (this.data?.person) {
        await this.update.execute(this.data.person.id, this.person);
        this.snack.open('Invitado actualizado correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } else {
        await this.add.execute(this.person);
        this.snack.open('Invitado agregado correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
      this.dialogRef.close(true);
    } catch (e: any) {
      this.snack.open(`Error: ${e.message}`, 'Cerrar', {
        duration: 4000,
        panelClass: ['snackbar-error']
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
