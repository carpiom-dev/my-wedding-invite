# My Wedding Invite - Angular 20

Este proyecto es una **invitación digital para boda** personalizada, construida con **Angular 20**, siguiendo una **arquitectura limpia (Clean Architecture)** y con integración en **Firestore** para persistencia multi-equipo en tiempo real.

## ✨ Características principales

- **CRUD de invitados** (crear, editar, eliminar, listar)
- **Validación de teléfono** con autocompletado de prefijo `593`
- **Envío de invitaciones por WhatsApp** (individual y masivo)
- **Mensajes personalizados** con preview
- **Snackbars Material** con paleta verde oliva/dorado
- **Confirmación de asistencia** por cada invitado
- **Actualización en tiempo real** de la tabla de invitados con Firestore (`onSnapshot`)
- Arquitectura limpia: `domain` / `application` / `infrastructure` / `presentation`
- UI elegante y profesional usando **Material Components**
- Compatible con múltiples navegadores y dispositivos

## 🏗️ Estructura del proyecto

src/app/
├─ domain/
│ ├─ entities/
│ │ └─ person.ts
│ └─ repositories/
│ └─ person.repository.ts
├─ application/
│ └─ use-cases/
│ ├─ add-person.usecase.ts
│ ├─ list-persons.usecase.ts
│ ├─ update-person.usecase.ts
│ ├─ remove-person.usecase.ts
│ └─ confirm-person.usecase.ts
├─ infrastructure/
│ ├─ repositories/
│ │ └─ person-firestore.repository.ts
│ └─ di/
│ └─ providers.ts
├─ presentation/
│ ├─ pages/
│ │ ├─ person-list/
│ │ └─ confirm-invite/
│ └─ components/
│ └─ person-dialog/

## ⚡ Tecnologías

- Angular 20 + TypeScript
- Angular Material
- Firestore (Firebase) para persistencia en tiempo real
- Snackbars Material con paleta verde oliva/dorado
- Arquitectura limpia (Clean Architecture)
- UUID para generar IDs únicos de invitados

## 🚀 Instalación y ejecución

  npm install

  ng serve

## 📝 Diagrama de secuencia

sequenceDiagram
    participant Admin as Admin/Organizador
    participant App as MyWeddingInviteApp
    participant WA as WhatsApp
    participant Guest as Invitado
    participant Firestore as Firestore DB

    Admin->>App: Agregar invitado (nombre, teléfono, nota)
    App->>Firestore: add(person)
    Firestore-->>App: Confirmación de registro

    Admin->>App: Enviar invitación WhatsApp
    App->>WA: Mensaje con URL personalizada
    WA-->>Guest: Recibe mensaje con link

    Guest->>App: Abre URL de confirmación
    App->>Guest: Carga ConfirmInviteComponent
    Guest->>App: Hace clic en "Confirmar asistencia"
    App->>App: ConfirmPerson.use-case
    App->>UpdatePerson: update.execute(id, { confirmado:true, fechaConfirmacion })
    UpdatePerson->>Firestore: update(person)
    Firestore-->>App: Actualización confirmada

    Firestore-->>App: onSnapshot (nuevo estado)
    App->>Admin: Actualiza tabla PersonListComponent en tiempo real
