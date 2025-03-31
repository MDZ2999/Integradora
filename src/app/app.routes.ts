import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'publish',
    loadComponent: () => import('./pages/publish/publish.page').then( m => m.PublishPage)
  },
  {
    path: 'baul',
    loadComponent: () => import('./pages/baul/baul.page').then( m => m.BaulPage)
  },
  {
    path: 'donaciones',
    loadComponent: () => import('./pages/donaciones/donaciones.page').then( m => m.DonacionesPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'configure-perfil',
    loadComponent: () => import('./pages/configure-perfil/configure-perfil.page').then( m => m.ConfigurePerfilPage)
  },

];
