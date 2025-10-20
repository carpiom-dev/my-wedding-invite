import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@presentation/material.module';

@Component({
  selector: 'app-message-preview-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './message-preview-dialog.component.html',
  styleUrls: ['./message-preview-dialog.component.scss']
})
export class MessagePreviewDialogComponent {
  data = inject(MAT_DIALOG_DATA) as { items: { nombre: string; mensaje: string; waUrl: string }[] };
  dialogRef = inject(MatDialogRef<MessagePreviewDialogComponent>);

  async copyAll() {
    const texto = this.data.items.map(i => `• ${i.nombre}\n${i.mensaje}`).join('\n\n');
    await navigator.clipboard.writeText(texto);
    alert('Texto copiado al portapapeles.');
  }

  async copyOne(mensaje: string) {
    await navigator.clipboard.writeText(mensaje);
    alert('Mensaje copiado.');
  }

  close() { this.dialogRef.close(); }
}
