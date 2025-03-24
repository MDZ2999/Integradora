import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usuarioId: string | null = null;

  constructor(private http: HttpClient) {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    this.isLoggedInSubject.next(loggedIn);
    this.usuarioId = localStorage.getItem('usuarioId');
  }

  // Iniciar sesión
  login(correo: string, contrasena: string) {
    return this.http.post<{ message: string, usuarioId: string }>(`${environment.backendUrl}/api/auth/login`, { correo, contrasena })
      .subscribe((response) => {
        if (response.usuarioId) {
          this.isLoggedInSubject.next(true);
          this.usuarioId = response.usuarioId;
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('usuarioId', response.usuarioId);
        }
      });
  }


  // Obtener estado de sesión
  get isLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  // Cerrar sesión
  logout() {
    this.isLoggedInSubject.next(false);
    localStorage.setItem('userLoggedIn', 'false');
    localStorage.removeItem('usuarioId');
  }
}
