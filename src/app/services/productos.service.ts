import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Producto } from '../models/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/api/productos';
  private cachedProductos: Producto[] | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos
  private readonly STORAGE_KEY = 'cached_productos';
  private imageCache: Map<string, string> = new Map();

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private loadFromLocalStorage() {
    const cached = localStorage.getItem(this.STORAGE_KEY);
    if (cached) {
      const { productos, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < this.CACHE_DURATION) {
        this.cachedProductos = productos;
        this.lastFetch = timestamp;
      }
    }
  }

  private saveToLocalStorage() {
    if (this.cachedProductos) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        productos: this.cachedProductos,
        timestamp: this.lastFetch
      }));
    }
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
    if (this.cachedProductos && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      console.log('Retornando productos desde caché');
      return of(this.cachedProductos);
    }

    console.log('Solicitando productos a:', this.apiUrl);
    const headers = this.getHeaders();
    
    return this.http.get<Producto[]>(this.apiUrl, { headers }).pipe(
      switchMap(productos => {
        console.log('Productos recibidos:', productos);
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
        this.cachedProductos = productosConImagenes;
        this.lastFetch = Date.now();
        this.saveToLocalStorage();
        console.log('Productos procesados y cacheados');
      }),
      catchError(error => {
        console.error('Error en el servicio:', error);
        throw new Error(`Error al obtener productos: ${error.message || 'Error desconocido'}`);
      })
    );
  }

  clearCache() {
    this.cachedProductos = null;
    this.lastFetch = 0;
    this.imageCache.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getProductosByUserId(userId: string): Observable<Producto[]> {
    const headers = this.getHeaders();
    return this.http.get<Producto[]>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      map(productos => {
        console.log('Productos del usuario recibidos:', productos);
        return productos;
      })
    );
  }

  crearProducto(productoData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, productoData, { headers }).pipe(
      tap(() => this.clearCache()), // Limpiar caché cuando se crea un nuevo producto
      catchError(error => {
        console.error('Error al crear producto:', error);
        if (error.status === 401) {
          throw new Error('No autorizado. Por favor, inicie sesión.');
        }
        throw error;
      })
    );
  }
}
