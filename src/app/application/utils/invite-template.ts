import { Person } from '@domain/entities/person';

export function buildInviteText(person: Person): string {
  const nombre = [person.nombre, person.apellido].filter(Boolean).join(' ');
  const baseUrl = 'https://tuboda.com/invitacion';
  const url = `${baseUrl}?nombre=${encodeURIComponent(nombre)}&id=${encodeURIComponent(person.id.value)}`;

  const confirmUrl = `https://carpiom-dev.github.io/my-wedding-invite/confirm?id=${encodeURIComponent(person.id.value)}`;

  return `💍 *Querido(a) ${nombre}*,

Con todo nuestro cariño, queremos invitarte a compartir un día muy especial en nuestras vidas.
Tu presencia hará de este momento algo inolvidable ✨

Haz clic aquí para ver tu invitación personalizada 👇
${url}

🔗 *Confirma tu asistencia haciendo clic en el siguiente enlace*:
${confirmUrl}
`;
}
