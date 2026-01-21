import { Routes } from '@angular/router';


export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'users',
    loadChildren: () => import('../../components/users/users.module').then(m => m.UsersModule)
  },

];
