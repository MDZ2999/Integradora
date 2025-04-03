import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Producto } from '../models/productos.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProductsService {
  private apiUrl = 'http://localhost:3000/api/productos';
  private cachedUserProducts: Producto[] | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private readonly STORAGE_KEY = 'cached_user_products';
  private imageCache: Map<string, string> = new Map();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadFromLocalStorage();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private loadFromLocalStorage() {
    const cached = localStorage.getItem(this.STORAGE_KEY);
    if (cached) {
      const { products, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < this.CACHE_DURATION) {
        console.log(' Cargando productos del usuario desde localStorage');
        this.cachedUserProducts = products;
        this.lastFetch = timestamp;
      }
    }
  }

  private saveToLocalStorage() {
    if (this.cachedUserProducts) {
      console.log(' Guardando productos del usuario en localStorage');
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        products: this.cachedUserProducts,
        timestamp: this.lastFetch
      }));
    }
  }

  private async loadImage(url: string, productName: string): Promise<string> {
    if (this.imageCache.has(url)) {
      console.log(` Usando imagen en caché para: ${productName}`);
      return this.imageCache.get(url)!;
    }

    if (url.startsWith('data:image')) {
      this.imageCache.set(url, url);
      return url;
    }

    try {
      console.log(` Cargando imagen para: ${productName}`);
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          this.imageCache.set(url, base64data);
          console.log(` Imagen cargada y cacheada para: ${productName}`);
          resolve(base64data);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(` Error cargando imagen para ${productName}:`, error);
      return url;
    }
  }

  getUserProducts(forceRefresh = false): Observable<Producto[]> {
    // Si tenemos productos en caché y no han expirado, retornarlos
    if (!forceRefresh && this.cachedUserProducts && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      console.log(' Retornando productos del usuario desde caché');
      return of(this.cachedUserProducts);
    }

    const userId = this.authService.getUsuarioId();
    if (!userId) {
      console.warn(' No se encontró ID de usuario');
      return of([]);
    }

    console.log(' Solicitando productos del usuario al servidor...');
    const headers = this.getHeaders();
    return this.http.get<Producto[]>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      tap(products => {
        console.log(' Productos recibidos del servidor:', products);
      }),
      switchMap(async products => {
        const productsWithImages = await Promise.all(
          products.map(async product => {
            const processedProduct = {
              ...product,
              Imagen: await this.loadImage(
                product.Imagen?.startsWith('data:image')
                  ? product.Imagen
                  : '../../../assets/img/card.jpeg',
                product.Nom_producto
              )
            };
            console.log(` Producto procesado: ${product.Nom_producto}`);
            return processedProduct;
          })
        );

        this.cachedUserProducts = productsWithImages;
        this.lastFetch = Date.now();
        this.saveToLocalStorage();
        
        return productsWithImages;
      })
    );
  }

  clearCache() {
    console.log(' Limpiando caché de productos del usuario');
    this.cachedUserProducts = null;
    this.lastFetch = 0;
    this.imageCache.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
