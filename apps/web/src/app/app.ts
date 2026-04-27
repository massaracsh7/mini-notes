import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './pages/login/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MenubarModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);
  authService = inject(AuthService);
  protected readonly title = signal('web');
  isAdmin = computed(() => localStorage.getItem('role') === 'admin');

  navItems = [
    { label: 'Notes', route: '/' },
    { label: 'Login', route: '/login' },
    { label: 'Admin', route: '/admin' },
  ];

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.authService.role.set('');
    this.router.navigateByUrl('/');
  }
}
