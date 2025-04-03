import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Producto } from '../models/productos.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/api/productos';
  private cachedProducts: Producto[] = [];
  private cachedUserProducts: { [key: string]: Producto[] } = {};
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private readonly STORAGE_KEY = 'cached_productos';
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
    const cachedUserData = localStorage.getItem('cached_user_products');
    if (cached) {
      const { productos, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < this.CACHE_DURATION) {
        console.log('📦 Cargando productos desde caché local');
        this.cachedProducts = productos;
        this.lastFetch = timestamp;
      }
    }
    if (cachedUserData) {
      this.cachedUserProducts = JSON.parse(cachedUserData);
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      productos: this.cachedProducts,
      timestamp: this.lastFetch
    }));
    localStorage.setItem('cached_user_products', JSON.stringify(this.cachedUserProducts));
  }

  private async loadImage(url: string): Promise<string> {
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url)!;
    }

    if (url.startsWith('data:image')) {
      this.imageCache.set(url, url);
      return url;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          this.imageCache.set(url, base64data);
          resolve(base64data);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading image:', error);
      return url;
    }
  }

  getProductosConUsuarios(): Observable<Producto[]> {
    // Si tenemos productos en caché y no han expirado, retornarlos
    if (this.cachedProducts.length > 0 && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      console.log('📦 Retornando productos desde caché');
      return of(this.cachedProducts);
    }

    console.log('📦 Solicitando productos al servidor');
    const headers = this.getHeaders();
    
    return this.http.get<Producto[]>(this.apiUrl, { headers }).pipe(
      switchMap(productos => {
        console.log('📦 Productos recibidos:', productos.length);
        const productosPromesas = productos.map(async producto => {
          const productoConImagenes = { ...producto };

          // Cargar y cachear la imagen del producto
          productoConImagenes.Imagen = await this.loadImage(
            producto.Imagen?.startsWith('data:image') 
              ? producto.Imagen 
              : '../../../assets/img/card.jpeg'
          );

          // Cargar y cachear la imagen del usuario
          if (producto.id_usuarios) {
            productoConImagenes.id_usuarios = {
              ...producto.id_usuarios,
              Imagen: await this.loadImage(
                producto.id_usuarios.Imagen?.startsWith('data:image')
                  ? producto.id_usuarios.Imagen
                  : '../../../assets/img/Perfil.jpeg'
              )
            };
          }

          return productoConImagenes;
        });

        return from(Promise.all(productosPromesas));
      }),
      tap(productosConImagenes => {
        this.cachedProducts = productosConImagenes;
        this.lastFetch = Date.now();
        this.saveToLocalStorage();
        console.log('📦 Productos procesados y cacheados');
      }),
      catchError(error => {
        console.error('❌ Error en el servicio:', error);
        throw error;
      })
    );
  }

  getProductosByUserId(userId: string): Observable<Producto[]> {
    // Verificar si tenemos productos en caché para este usuario
    if (this.cachedUserProducts[userId] && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      console.log('👤 Retornando productos del usuario desde caché');
      return of(this.cachedUserProducts[userId]);
    }

    const headers = this.getHeaders();
    return this.http.get<Producto[]>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      tap(productos => {
        console.log('👤 Productos del usuario recibidos:', productos);
        // Guardar en caché los productos del usuario
        this.cachedUserProducts[userId] = productos;
        this.saveToLocalStorage();
      })
    );
  }

  crearProducto(productoData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, productoData, { headers }).pipe(
      tap(() => {
        console.log('✨ Nuevo producto creado');
        this.clearCache(); // Limpiar caché cuando se crea un nuevo producto
      }),
      catchError(error => {
        console.error('❌ Error al crear producto:', error);
        if (error.status === 401) {
          throw new Error('No autorizado. Por favor, inicie sesión.');
        }
        throw error;
      })
    );
  }

  clearCache() {
    this.cachedProducts = [];
    this.cachedUserProducts = {};
    this.lastFetch = 0;
    this.imageCache.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('cached_user_products');
    console.log('🧹 Caché de productos limpiado');
  }
}
