import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    loadComponent: () => import('../app/pages/main/main').then((m) => m.Main)
},
{
    path: 'login',
    loadComponent: () => import('../app/pages/login/login').then((m) => m.Login)
}
];
