import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private usuarioId: string | null = null;

  constructor(private http: HttpClient) {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    this.isLoggedInSubject.next(loggedIn);
    this.usuarioId = localStorage.getItem('usuarioId');
  }

  // Iniciar sesión
  login(correo: string, contrasena: string) {
    return this.http.post<{ message: string, usuarioId: string }>(`${environment.backendUrl}/api/auth/login`, { correo, contrasena });
  }

  // Obtener estado de sesión
  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Método para actualizar el estado de la sesión
  updateSessionState(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
    localStorage.setItem('userLoggedIn', isLoggedIn ? 'true' : 'false');
  }

  // Verifica si hay una sesión guardada en `localStorage`
  private checkLoginStatus(): boolean {
    return localStorage.getItem('userLoggedIn') === 'true';
  }

  // Método de logout
  logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('usuarioId');
    this.isLoggedInSubject.next(false);
  }
}
