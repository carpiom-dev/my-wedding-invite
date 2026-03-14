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
    : { nombre: '', apellido: '', telefono: '', nota: '', enviado: false, cantidadAdmisiones: 0 };

  ngOnInit() {
    this.onPhoneBlur(); // autocorregir teléfono si ya viene cargado
  }

  onPhoneBlur() {
    if (!this.person.telefono) return;
    // Solo eliminar caracteres no numéricos (espacios, guiones, paréntesis, etc.)
    this.person.telefono = this.person.telefono.trim().replace(/[^\d+]/g, '');
  }

  isPhoneValid(phone?: string | null): boolean {
    if (!phone || phone.trim().length === 0) return true; // campo opcional
    // Eliminar todo excepto dígitos
    const digits = phone.trim().replace(/\D/g, '');
    // Estándar E.164: entre 7 y 15 dígitos
    return digits.length >= 7 && digits.length <= 15;
  }

  async save() {
    if (!this.isPhoneValid(this.person.telefono)) {
      this.snack.open('Número inválido. Ingresa entre 7 y 15 dígitos.', 'Cerrar', {
        duration: 4000,
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
