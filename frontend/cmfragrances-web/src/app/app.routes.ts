import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Home } from './features/home/home';

import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: '',
    component: MainLayout,
    children: [

      {
        path: 'home',
        component: Home
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];