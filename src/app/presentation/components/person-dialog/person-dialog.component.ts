import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '@presentation/material.module';
import { Person } from '@domain/entities/person';
import { ADD_PERSON, UPDATE_PERSON } from '@infrastructure/di/injection-tokens';
import { PersonFirestoreRepository } from '@infrastructure/repositories/person-firestore.repository';  // Asegúrate de importar el repositorio

@Component({
  selector: 'app-person-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})
export class PersonDialogComponent {
  private add = inject(ADD_PERSON);
  isLoading = false;
  private update = inject(UPDATE_PERSON);
  private snack = inject(MatSnackBar);
  private personRepo = inject(PersonFirestoreRepository);

  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<PersonDialogComponent>);

  person: Person = this.data?.person
    ? { ...this.data.person }
    : { nombre: '', apellido: '', telefono: '', nota: '', enviado: false };

  ngOnInit() {
    this.onPhoneBlur();
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
     this.isLoading = true;
    if (!this.validatePerson(this.person)) return;

    try {
      if (this.data?.person) {
        await this.update.execute(this.data.person.id, this.person);
        this.snack.open('Invitado actualizado correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } else {
        const phoneExists = await this.personRepo.phoneExists(this.person.telefono || '');
        if (phoneExists) {
          this.snack.open('El número de teléfono ya está registrado en otro invitado.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
          return;
        }

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
    }finally {
      this.isLoading = false;
    }
  }


  cancel() {
    this.dialogRef.close(false);
  }

  isValidNombre(nombre: string): boolean {
    return nombre.trim().length > 0;
  }

  isValidApellido(apellido: string): boolean {
    return apellido.trim().length > 0;
  }

  isValidTelefono(telefono: string): boolean {
    return this.isPhoneValid(telefono);  // Usando la validación de teléfono que ya tienes
  }

  validatePerson(person: Person): boolean {
    if (!this.isValidNombre(person.nombre)) {
      this.snack.open('El nombre es obligatorio y no puede estar vacío', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return false;
    }

    if (!this.isValidApellido(person.apellido || '')) {
      this.snack.open('El apellido es obligatorio y no puede estar vacío', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return false;
    }

    if (!this.isValidTelefono(person.telefono || '')) {
      this.snack.open('El número de teléfono no es válido. Ej: 593999000111', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return false;
    }

    return true;
  }
}
