import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@presentation/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LIST_PERSONS, REMOVE_PERSON } from '@infrastructure/di/injection-tokens';
import { WhatsappService } from '@infrastructure/services/whatsapp.service';
import { PersonDialogComponent } from '@presentation/components/person-dialog/person-dialog.component';
import { MessagePreviewDialogComponent } from '@presentation/components/message-preview-dialog/message-preview-dialog.component';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent {
  private list = inject(LIST_PERSONS);
  private remove = inject(REMOVE_PERSON);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private wa = inject(WhatsappService);

  data = signal<any[]>([]);
  displayedColumns = ['select', 'nombre', 'telefono', 'acciones'];
  selectedCount = 0;

  async ngOnInit() {
    await this.refresh();
  }

  async refresh() {
    const people = await this.list.execute();
    // Reinicia selección
    this.data.set(people.map(p => ({ ...p, selected: false })));
    this.updateSelection();
  }

  openDialog(person?: any) {
    const ref = this.dialog.open(PersonDialogComponent, {
      width: '400px',
      data: { person }
    });

    ref.afterClosed().subscribe(async (result) => {
      if (result) {
        this.snack.open('Guardado correctamente', 'Cerrar', { duration: 2000 });
        await this.refresh();
      }
    });
  }

  async delete(id: string) {
    await this.remove.execute({ value: id });
    this.snack.open('Eliminado correctamente', 'Cerrar', { duration: 2000 });
    await this.refresh();
  }

  async sendOne(person: any) {
    await this.wa.openIndividual(person);
    await this.refresh();
  }

  async sendSelected() {
    const selected = this.data().filter(p => p.selected && !p.enviado);
    if (selected.length === 0) {
      this.snack.open('No hay invitados seleccionados para enviar.', 'Cerrar', { duration: 2000 });
      return;
    }
    await this.wa.openBulk(selected);
    await this.refresh();
    this.snack.open(`Enviado a ${selected.length} invitado(s).`, 'Cerrar', { duration: 3000 });
  }

  // --- Métodos auxiliares de selección ---
  updateSelection() {
    const count = this.data().filter(p => p.selected).length;
    this.selectedCount = count;
  }

  toggleAll(checked: boolean) {
    this.data.update(list => list.map(p => ({ ...p, selected: checked && !p.enviado })));
    this.updateSelection();
  }

  allSelected() {
    const list = this.data();
    const selectable = list.filter(p => !p.enviado);
    return selectable.length > 0 && selectable.every(p => p.selected);
  }

  someSelected() {
    const list = this.data();
    const selectable = list.filter(p => !p.enviado);
    return selectable.some(p => p.selected) && !this.allSelected();
  }

  previewOne(person: any) {
  const mensaje = this.wa.buildMessage(person);
  const waUrl = this.wa.buildUrl(person);
  this.dialog.open(MessagePreviewDialogComponent, {
    width: '640px',
    data: {
      items: [{
        nombre: `${person.nombre} ${person.apellido ?? ''}`.trim(),
        mensaje,
        waUrl
      }]
    }
  });
}

previewSelected() {
  const selected = this.data().filter(p => p.selected);
  if (selected.length === 0) { return; }

  const items = selected.map(p => ({
    nombre: `${p.nombre} ${p.apellido ?? ''}`.trim(),
    mensaje: this.wa.buildMessage(p),
    waUrl: this.wa.buildUrl(p),
  }));

  this.dialog.open(MessagePreviewDialogComponent, {
    width: '720px',
    data: { items }
  });
}
}
