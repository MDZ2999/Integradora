import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface LoginResponse {
  message: string;
  token: string;
  usuario: {
    id: string;
    nombre: string;
    correo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usuarioId: string | null = null;
  private usuarioNombreSubject = new BehaviorSubject<string>('');

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    this.isLoggedInSubject.next(loggedIn);
    this.usuarioId = localStorage.getItem('usuarioId');
    const storedNombre = localStorage.getItem('usuarioNombre') || '';
    this.usuarioNombreSubject.next(storedNombre);
  }

  // Iniciar sesión
  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { correo, contrasena });
  }

  // Registrar nuevo usuario
  register(formData: FormData): Observable<{ message: string, usuarioId: string }> {
    return this.http.post<{ message: string, usuarioId: string }>(`${this.apiUrl}/register`, formData);
  }

  // Actualizar estado de sesión
  updateSessionState(loggedIn: boolean, nombre: string = '', token?: string) {
    this.isLoggedInSubject.next(loggedIn);
    this.usuarioNombreSubject.next(nombre);
    localStorage.setItem('userLoggedIn', loggedIn ? 'true' : 'false');
    if (nombre) {
      localStorage.setItem('usuarioNombre', nombre);
    }
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.usuarioNombreSubject.next('');
  }

  // Obtener ID del usuario actual
  getUsuarioId(): string | null {
    return localStorage.getItem('usuarioId');
  }

  // Establecer ID del usuario
  setUsuarioId(id: string) {
    this.usuarioId = id;
    localStorage.setItem('usuarioId', id);
  }

  // Getters para observables
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUsuarioNombre(): Observable<string> {
    return this.usuarioNombreSubject.asObservable();
  }
}
