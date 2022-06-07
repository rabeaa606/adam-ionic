import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  },
  {
    path: 'dates',
    loadChildren: () => import('../admin/dates/dates.module').then(m => m.DatesPageModule)
  },
  {
    path: 'program',
    loadChildren: () => import('../admin/program/program.module').then(m => m.ProgramPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule { }
