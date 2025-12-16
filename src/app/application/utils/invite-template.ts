import { Person } from '@domain/entities/person';

export function buildInviteText(person: Person): string {
  const nombre = [person.nombre, person.apellido].filter(Boolean).join(' ');

  const baseUrl = 'https://carpiom-dev.github.io/wedding-invite';

  const invitados = person.cantidadAdmisiones ?? 1;

  const url = `${baseUrl}?nombre=${encodeURIComponent(nombre)}&invitados=${encodeURIComponent(invitados)}`;

  return `Estimado(a) ${nombre},

Esperamos que se encuentre muy bien.
Con mucho cariño, deseamos confirmar con usted su asistencia a nuestro matrimonio, ya que nos encontramos en la etapa final de organización del evento.

Esta invitación es válida para ${invitados} persona(s).

Le agradeceríamos que pueda confirmar su asistencia a través del siguiente enlace a más tardar el día 25 de este mes.
En caso de no recibir su confirmación dentro del plazo indicado, entenderemos que no podrá acompañarnos y no podremos considerarlo dentro de la planificación del evento.

${url}

Agradecemos mucho su comprensión y esperamos contar con su presencia.
Cordialmente,
Adrian & Josselyn`;
}
