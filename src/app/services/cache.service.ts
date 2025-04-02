import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private imageCache: Map<string, string> = new Map();
  private readonly CACHE_PREFIX = 'app_cache_';

  constructor() {
    this.loadCacheFromStorage();
  }

  private loadCacheFromStorage() {
    // Cargar caché almacenado al iniciar el servicio
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          this.imageCache.set(key.replace(this.CACHE_PREFIX, ''), value);
        }
      }
    }
  }

  async cacheImage(url: string): Promise<string> {
    // Verificar si la imagen ya está en caché
    const cachedImage = this.imageCache.get(url);
    if (cachedImage) {
      return cachedImage;
    }

    try {
      // Descargar y convertir la imagen a base64
      const response = await fetch(url);
      const blob = await response.blob();
      const base64 = await this.blobToBase64(blob);

      // Guardar en caché y storage
      this.imageCache.set(url, base64);
      localStorage.setItem(this.CACHE_PREFIX + url, base64);

      return base64;
    } catch (error) {
      console.error('Error caching image:', error);
      return url; // Retornar URL original si hay error
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  clearCache() {
    this.imageCache.clear();
    // Limpiar solo las entradas de caché, no todo el localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
}
