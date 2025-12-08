import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '@presentation/material.module';
import { LIST_PERSONS, REMOVE_PERSON } from '@infrastructure/di/injection-tokens';
import { WhatsappService } from '@infrastructure/services/whatsapp.service';
import { PersonDialogComponent } from '@presentation/components/person-dialog/person-dialog.component';
import { MessagePreviewDialogComponent } from '@presentation/components/message-preview-dialog/message-preview-dialog.component';
import { PersonFirestoreRepository } from '@infrastructure/repositories/person-firestore.repository';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, MatPaginatorModule],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent {
  private list = inject(LIST_PERSONS);
  private remove = inject(REMOVE_PERSON);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private wa = inject(WhatsappService);
  private repo = inject(PersonFirestoreRepository);
  data = signal<any[]>([]);
  displayedColumns = ['select','index', 'nombre', 'telefono','cantidadAdmisiones','confirmado', 'acciones'];
  selectedCount = 0;
  filter = signal('');
  pageIndex = signal(0);
  pageSize = signal(5);

  totalAdmisiones = computed(() =>
    this.data().reduce((acc, p) => acc + (p.cantidadAdmisiones ?? 0), 0)
  );

filteredData = computed(() => {
  const term = this.filter().toLowerCase();

  return this.data().filter(p => {
    const nombre = (p.nombre ?? '').toLowerCase();
    const apellido = (p.apellido ?? '').toLowerCase();
    const telefono = (p.telefono ?? '');

    return (
      nombre.includes(term) ||
      apellido.includes(term) ||
      telefono.includes(term)
    );
  });
});

  pagedData = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredData().slice(start, end);
  });
    async ngOnInit() {
      console.log(this.data)
      this.repo.onSnapshot((persons) => {
        this.data.set(persons.map(p => ({ ...p, selected: false })));
        this.updateSelection();
      });
    }

  async refresh() {
    const people = await this.list.execute();
    this.data.set(people.map(p => ({ ...p, selected: false })));
    this.updateSelection();
  }

  openDialog(person?: any) {
    const ref = this.dialog.open(PersonDialogComponent, {
      width: '100%',
      maxWidth: '100vh',
      height: 'auto',
      maxHeight: '100vh',
      data: { person }
    });

    ref.afterClosed().subscribe(async result => {
      if (result) await this.refresh();
    });
  }

  async delete(id: string) {
    await this.remove.execute({ value: id });
    this.snack.open('Invitado eliminado', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
    await this.refresh();
  }

  // WhatsApp
  async sendOne(person: any) {
    const phone = person.telefono?.replace(/\D/g, '');
    if (!/^593\d{9}$/.test(phone)) {
      this.snack.open(`Número inválido para ${person.nombre}`, 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    await this.wa.openIndividual(person);
    await this.refresh();
    this.snack.open(`Mensaje de ${person.nombre} abierto en WhatsApp`, 'Cerrar', { duration: 3000, panelClass: ['snackbar-info'] });
  }

  async sendSelected() {
    const selected = this.data().filter(p => p.selected && !p.enviado);
    if (!selected.length) {
      this.snack.open('No hay invitados seleccionados para enviar', 'Cerrar', { duration: 2500, panelClass: ['snackbar-info'] });
      return;
    }
    await this.wa.openBulk(selected);
    await this.refresh();
    this.snack.open(`Mensajes abiertos en WhatsApp para ${selected.length} invitado(s)`, 'Cerrar', { duration: 3500, panelClass: ['snackbar-success'] });
  }

  // Preview
  previewOne(person: any) {
    const mensaje = this.wa.buildMessage(person);
    const waUrl = this.wa.buildUrl(person);
    this.dialog.open(MessagePreviewDialogComponent, {
      width: '100%',
      maxWidth: '100vh',
      height: 'auto',
      maxHeight: '100vh',
      data: { items: [{ nombre: `${person.nombre} ${person.apellido}`, mensaje, waUrl }] }
    });
  }

  previewSelected() {
    const selected = this.data().filter(p => p.selected);
    if (!selected.length) return;
    const items = selected.map(p => ({
      nombre: `${p.nombre} ${p.apellido}`,
      mensaje: this.wa.buildMessage(p),
      waUrl: this.wa.buildUrl(p)
    }));
    this.dialog.open(MessagePreviewDialogComponent, { width: '720px', data: { items } });
  }

  // Selección
  updateSelection() { this.selectedCount = this.data().filter(p => p.selected).length; }
  toggleAll(checked: boolean) { this.data.update(list => list.map(p => ({ ...p, selected: checked && !p.enviado }))); this.updateSelection(); }
  allSelected() { const list = this.data(); const selectable = list.filter(p => !p.enviado); return selectable.length > 0 && selectable.every(p => p.selected); }
  someSelected() { const list = this.data(); const selectable = list.filter(p => !p.enviado); return selectable.some(p => p.selected) && !this.allSelected(); }
}
