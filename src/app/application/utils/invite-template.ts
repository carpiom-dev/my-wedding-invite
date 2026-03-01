import { Person } from '@domain/entities/person';

export function buildInviteText(person: Person): string {

  const invitados = person.cantidadAdmisiones ?? 1;

  const bride = person.nombre;
  const groom = person.apellido ?? '';

  const baseUrl = 'https://carpiom-dev.github.io/invitacion-boda/';

  const url =
    `${baseUrl}?bride=${encodeURIComponent(bride)}&groom=${encodeURIComponent(groom)}&adm=${encodeURIComponent(invitados)}`;

  return `Estimado(a)  ${groom} ${bride},

Esperamos que se encuentre muy bien.
Con mucho cariño, deseamos confirmar con usted su asistencia a nuestro matrimonio, ya que nos encontramos en la etapa final de organización del evento.

Esta invitación es válida para ${invitados} persona(s).

Le agradeceríamos que pueda confirmar su asistencia a través del siguiente enlace a más tardar el día 25 de este mes.
En caso de no recibir su confirmación dentro del plazo indicado, entenderemos que no podrá acompañarnos y no podremos considerarlo dentro de la planificación del evento.

${url}

Agradecemos mucho su comprensión y esperamos contar con su presencia.
Cordialmente,
Ruben & Madeline`;
}
