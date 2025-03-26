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
  private usuarioNombreSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    this.isLoggedInSubject.next(loggedIn);
    this.usuarioId = localStorage.getItem('usuarioId');
    const storedNombre = localStorage.getItem('usuarioNombre') || '';
    this.usuarioNombreSubject.next(storedNombre);
  }

  // Iniciar sesión
  login(correo: string, contrasena: string) {
    return this.http.post<{ message: string, usuarioId: string, nombre: string }>(`${environment.backendUrl}/api/auth/login`, { correo, contrasena });
  }

  // Obtener estado de sesión
  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Método para actualizar el estado de la sesión
  updateSessionState(isLoggedIn: boolean, nombre: string = '') {
    console.log('Actualizando estado de sesión:', isLoggedIn, 'Nombre:', nombre);
    this.isLoggedInSubject.next(isLoggedIn);
    this.usuarioNombreSubject.next(nombre);
    localStorage.setItem('userLoggedIn', isLoggedIn ? 'true' : 'false');
    if (nombre) {
      localStorage.setItem('usuarioNombre', nombre);
    }
  }

  // Verifica si hay una sesión guardada en `localStorage`
  private checkLoginStatus(): boolean {
    return localStorage.getItem('userLoggedIn') === 'true';
  }

  // Método de logout
  logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    this.isLoggedInSubject.next(false);
  }

  // Obtener el Nombre del usuario
  get usuarioNombre$() {
    return this.usuarioNombreSubject.asObservable();
  }

}
