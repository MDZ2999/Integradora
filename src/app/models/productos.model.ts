export interface Usuario {
  _id: string;
  Nombre: string;
  Imagen: string;
}

export interface Producto {
  _id: string;
  Nom_producto: string;
  id_usuarios: Usuario;
  Imagen: string;
  Cantidad: number;
  Municipio: string;
  Codigo_postal: number;
  Numero_telefonico: number;
  Calidad: string;
  Categoria: string;
  Subcategoria: string;
  Descripcion: string;
}
