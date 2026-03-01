import { Person } from '@domain/entities/person';

export function buildInviteText(person: Person): string {

  const invitado = [person.nombre, person.apellido]
    .filter(Boolean)
    .join(' ');

  const invitados = person.cantidadAdmisiones ?? 1;

  const bride = person.nombre;
  const groom = person.apellido ?? '';

  const baseUrl = 'https://carpiom-dev.github.io/invitacion-boda/';

  const url =
    `${baseUrl}?groom=${bride}&bride=${encodeURIComponent(groom)}&adm=${encodeURIComponent(invitados)}`;

  return `Estimado(a) ${invitado},

Con profunda alegría y gratitud a Dios, queremos compartir con usted una noticia muy especial en nuestras vidas: hemos decidido unirnos en matrimonio.

Sería un honor inmenso contar con su presencia en este día tan significativo, donde celebraremos el amor, la fe y el inicio de un nuevo camino juntos, bajo la bendición del Señor.

Esta invitación es válida para ${invitados} persona(s).

Hemos preparado con mucho cariño nuestra invitación digital, donde podrá encontrar todos los detalles de esta hermosa celebración:

${url}

Gracias por acompañarnos con su afecto, sus oraciones y sus buenos deseos en esta nueva etapa que comenzamos.

Con cariño y bendiciones.

Cordialmente,
Ruben & Madeline`;
}
