export interface Producto {
  _id: string;
  Nom_producto: string;
  Cantidad?: number;
  Municipio?: string;
  Codigo_postal?: number;
  Calidad?: string;
  Categoria?: string;
  Descripcion?: string;
  id_usuarios: {
    _id: string;
    Nombre: string;
    Imagen?: string;
  };
  Imagen?: string;
}
