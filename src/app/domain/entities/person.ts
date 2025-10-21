export interface PersonId {
  value: string;
}

export interface Person {
  id: PersonId;
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;
  nota?: string | null;
  enviado: boolean;
  confirmado?: boolean;
  fechaConfirmacion?: string;
}
