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
    imagen: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usuarioId: string | null = null;
  private usuarioNombreSubject = new BehaviorSubject<string>('');
  private usuarioImagenSubject = new BehaviorSubject<string>('');

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {
    this.loadUserData();
  }

  private loadUserData() {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    this.isLoggedInSubject.next(loggedIn);
    this.usuarioId = localStorage.getItem('usuarioId');
    const storedNombre = localStorage.getItem('usuarioNombre') || '';
    const storedImagen = localStorage.getItem('usuarioImagen') || '';
    this.usuarioNombreSubject.next(storedNombre);
    this.usuarioImagenSubject.next(storedImagen);
  }

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { correo, contrasena });
  }

  register(formData: FormData): Observable<{ message: string, usuarioId: string }> {
    return this.http.post<{ message: string, usuarioId: string }>(`${this.apiUrl}/register`, formData);
  }

  updateSessionState(loggedIn: boolean, usuario?: { nombre: string; id: string; imagen?: string }, token?: string) {
    this.isLoggedInSubject.next(loggedIn);
    
    if (usuario) {
      this.usuarioNombreSubject.next(usuario.nombre);
      this.usuarioId = usuario.id;
      if (usuario.imagen) {
        this.usuarioImagenSubject.next(usuario.imagen);
        localStorage.setItem('usuarioImagen', usuario.imagen);
      }
      localStorage.setItem('usuarioNombre', usuario.nombre);
      localStorage.setItem('usuarioId', usuario.id);
    }
    
    if (token) {
      localStorage.setItem('token', token);
    }
    
    localStorage.setItem('userLoggedIn', loggedIn ? 'true' : 'false');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioImagen');
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.usuarioNombreSubject.next('');
    this.usuarioImagenSubject.next('');
  }

  getUsuarioId(): string | null {
    return this.usuarioId;
  }

  setUsuarioId(id: string) {
    this.usuarioId = id;
    localStorage.setItem('usuarioId', id);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUsuarioNombre(): Observable<string> {
    return this.usuarioNombreSubject.asObservable();
  }

  getUsuarioIdPromise(): Promise<string | null> {
    return Promise.resolve(this.usuarioId);
  }

  getUsuarioImagen(): Observable<string> {
    return this.usuarioImagenSubject.asObservable();
  }
}
