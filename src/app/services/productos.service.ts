import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Usuario {
  _id: string;
  Nombre: string;
  Imagen: string;
}

interface Producto {
  _id: string;
  Nom_producto: string;
  id_usuarios: Usuario; // Ahora este campo ya contiene los datos del usuario
  Imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/api'; // URL del backend

  constructor(private http: HttpClient) { }

  getProductosConUsuarios(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`).pipe(
      catchError(error => {
        console.error('Error en el servicio:', error);
        throw new Error(`Error al obtener productos: ${error.message || 'Error desconocido'}`);
      })
    );
  }
}
