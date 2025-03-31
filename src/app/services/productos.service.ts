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
        return productos.map(producto => ({
          ...producto,
          Imagen: producto.Imagen || '../../../assets/img/card.jpeg',
          id_usuarios: {
            ...producto.id_usuarios,
            Imagen: producto.id_usuarios?.Imagen || '../../../assets/img/Perfil.jpeg'
          }
        }));
      }),
      catchError(error => {
        console.error('Error en el servicio:', error);
        throw new Error(`Error al obtener productos: ${error.message || 'Error desconocido'}`);
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
          throw new Error('Usuario no autenticado. Por favor, inicie sesión.');
        }
        throw new Error(`Error al crear producto: ${error.message || 'Error desconocido'}`);
      })
    );
  }
}
