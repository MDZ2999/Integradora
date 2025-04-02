import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly TOKEN_NAME = 'auth_token';

  setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
  }

  getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  // Métodos específicos para el token
  setToken(token: string) {
    this.setCookie(this.TOKEN_NAME, token, 7); // Token válido por 7 días
    // Eliminar el token del localStorage por seguridad
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return this.getCookie(this.TOKEN_NAME);
  }

  deleteToken() {
    this.deleteCookie(this.TOKEN_NAME);
  }
}
