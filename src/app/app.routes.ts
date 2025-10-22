import { Routes } from '@angular/router';
import { ConfirmInviteComponent } from '@presentation/pages/confirm-invite/confirm-invite.component';
import { PersonListComponent } from '@presentation/pages/person-list/person-list.component';

export const routes: Routes = [
  { path: '', component: PersonListComponent },
   {
    path: 'confirm',
    component: ConfirmInviteComponent
  },
  { path: '**', redirectTo: '' },
];
