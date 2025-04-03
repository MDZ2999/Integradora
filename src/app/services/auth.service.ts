import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

interface UpdateProfileResponse {
  imagen?: string;
  mensaje?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usuarioId: string | null = null;
  private usuarioNombreSubject = new BehaviorSubject<string>('');
  private usuarioImagenSubject = new BehaviorSubject<string>('');

  private apiUrl = environment.backendUrl + '/api/auth';

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

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { correo, contrasena });
  }

  register(formData: FormData): Observable<{ message: string, usuarioId: string }> {
    return this.http.post<{ message: string, usuarioId: string }>(`${this.apiUrl}/register`, formData);
  }

  updateProfile(userId: string, formData: FormData): Observable<UpdateProfileResponse> {
    const headers = this.getHeaders();
    
    // Log del FormData para debugging
    console.log('FormData contenido:');
    formData.forEach((value, key) => {
      if (key === 'imagen') {
        const file = value as File;
        console.log(key, ':', file.name, 'tipo:', file.type, 'tamaño:', file.size);
      } else {
        console.log(key, ':', value);
      }
    });

    return this.http.put<UpdateProfileResponse>(`${this.apiUrl}/usuarios/${userId}`, formData, { headers }).pipe(
      tap(response => {
        console.log('Respuesta del servidor:', response);
        
        // Actualizar el estado local solo si la respuesta es exitosa
        const nombre = formData.get('nombre') as string;
        if (nombre) {
          const apellidoPaterno = formData.get('apellidoPaterno') as string;
          const apellidoMaterno = formData.get('apellidoMaterno') as string;
          const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
          this.usuarioNombreSubject.next(nombreCompleto);
          localStorage.setItem('usuarioNombre', nombreCompleto);
        }

        // Si hay una nueva imagen, actualizar la URL de la imagen
        if (response && response.imagen) {
          console.log('Nueva URL de imagen:', response.imagen);
          this.usuarioImagenSubject.next(response.imagen);
          localStorage.setItem('usuarioImagen', response.imagen);
        }
      }),
      catchError(error => {
        console.error('Error en updateProfile:', error);
        if (error.error && error.error.message) {
          console.error('Mensaje del servidor:', error.error.message);
        }
        return throwError(() => ({
          error: error.error?.message || 'Error al actualizar el perfil',
          status: error.status
        }));
      })
    );
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

  getUsuarioIdPromise(): Promise<string | null> {
    return Promise.resolve(this.usuarioId);
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

  getUsuarioImagen(): Observable<string> {
    return this.usuarioImagenSubject.asObservable();
  }
}
