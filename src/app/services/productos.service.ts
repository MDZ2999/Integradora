import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Producto } from '../models/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProductosConUsuarios(): Observable<Producto[]> {
    console.log('Solicitando productos a:', this.apiUrl);
    const headers = this.getHeaders();
    return this.http.get<Producto[]>(this.apiUrl, { headers }).pipe(
      map(productos => {
        console.log('Productos recibidos:', productos);
        return productos.map(producto => {
          // Solo asignar imagen por defecto si no existe la imagen
          const productoConImagenes = {
            ...producto,
            // No reemplazar la imagen si ya existe
            Imagen: producto.Imagen && producto.Imagen.startsWith('data:image') 
              ? producto.Imagen 
              : '../../../assets/img/card.jpeg'
          };

          // Si el usuario existe, manejar su imagen
          if (producto.id_usuarios) {
            productoConImagenes.id_usuarios = {
              ...producto.id_usuarios,
              // No reemplazar la imagen si ya existe
              Imagen: producto.id_usuarios.Imagen && producto.id_usuarios.Imagen.startsWith('data:image')
                ? producto.id_usuarios.Imagen
                : '../../../assets/img/Perfil.jpeg'
            };
          }

          console.log('Producto procesado:', {
            id: productoConImagenes._id,
            nombre: productoConImagenes.Nom_producto,
            imagenProducto: productoConImagenes.Imagen.substring(0, 30) + '...',
            imagenUsuario: productoConImagenes.id_usuarios?.Imagen.substring(0, 30) + '...'
          });

          return productoConImagenes;
        });
      }),
      catchError(error => {
        console.error('Error en el servicio:', error);
        throw new Error(`Error al obtener productos: ${error.message || 'Error desconocido'}`);
      })
    );
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
    console.log('Token:', headers.get('Authorization'));
    
    return this.http.post(this.apiUrl, productoData, { headers }).pipe(
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
