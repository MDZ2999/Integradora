export interface Usuario {
  _id: string;
  Nombre: string;
  Imagen: string;
}

export interface Producto {
  _id?: string;
  Nom_producto: string;
  Descripcion: string;
  Categoria: string;
  Cantidad: number;
  Estado: 'Disponible' | 'No disponible';
  id_usuarios: any;
  Imagen?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
