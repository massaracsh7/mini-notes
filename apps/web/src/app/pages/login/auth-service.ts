import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { API_URL } from '../../constants';

interface UserResponse {
  id: number;
  email: string;
  role: string;
}

interface LoginResponse {
  accessToken: string;
  user: UserResponse;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public http = inject(HttpClient);
  public role = signal('');
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('role', res.user.role);
        this.role.set(res.user.role);
      }),
    );
  }
}
