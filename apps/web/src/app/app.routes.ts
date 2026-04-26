import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../app/pages/main/main').then((m) => m.Main),
  },
  {
    path: 'login',
    loadComponent: () => import('../app/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    loadComponent: () => import('../app/pages/admin/admin').then((m) => m.Admin),
  },
  {
    path: 'posts/:slug',
    loadComponent: () => import('../app/pages/post/post').then((m) => m.PostPage),
  },
  {
    path: '404',
    loadComponent: () => import('../app/pages/not-found/not-found').then((m) => m.NotFoundPage) 
  },
  {
    path: '**',
    redirectTo: '/404'
  }

];
