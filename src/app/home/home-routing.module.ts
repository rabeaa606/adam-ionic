import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        loadChildren: () => import('.././customer/customer.module').then(m => m.CustomerPageModule)

      },
      {
        path: 'customer',
        loadChildren: () => import('.././customer/customer.module').then(m => m.CustomerPageModule)

      },
      {
        path: 'admin',
        loadChildren: () => import('.././auth/auth.module').then(m => m.AuthPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
