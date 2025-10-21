import { Person } from '@domain/entities/person';

export function buildInviteText(person: Person): string {
  const nombre = [person.nombre, person.apellido].filter(Boolean).join(' ');

  const baseUrl = 'https://carpiom-dev.github.io/wedding-invite';

  const invitados = person.cantidadAdmisiones ?? 1;

  const url = `${baseUrl}?nombre=${encodeURIComponent(nombre)}&invitados=${encodeURIComponent(invitados)}`;

  return `💍 *Querido(a) ${nombre}*,

Con todo nuestro cariño, queremos invitarte a compartir un día muy especial en nuestras vidas.
Tu presencia hará de este momento algo inolvidable ✨

👥 Invitación válida para *${invitados}* persona(s)

Haz clic aquí para ver tu invitación personalizada 👇
${url}`;
}
