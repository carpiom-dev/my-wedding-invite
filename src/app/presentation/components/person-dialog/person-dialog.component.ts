import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@presentation/material.module';
import { ADD_PERSON, UPDATE_PERSON } from '@infrastructure/di/injection-tokens';
import { Person } from '@domain/entities/person';

@Component({
  selector: 'app-person-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})
export class PersonDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PersonDialogComponent>);
  private add = inject(ADD_PERSON);
  private update = inject(UPDATE_PERSON);
  data = inject(MAT_DIALOG_DATA) as { person?: Person };

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: [''],
    telefono: [''],
    nota: ['']
  });

  ngOnInit() {
    if (this.data?.person) {
      this.form.patchValue(this.data.person);
    }
  }

  async save() {
    const value = this.form.value;

    try {
      if (this.data?.person) {
        await this.update.execute(this.data.person.id, value);
      } else {
        await this.add.execute(value);
      }
      this.dialogRef.close(true);
    } catch (e: any) {
      alert(e.message);
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
