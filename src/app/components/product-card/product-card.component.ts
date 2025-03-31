import { Component, OnInit, Input } from '@angular/core';
import { IonCard } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/productos.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [IonCard, CommonModule],
  standalone: true
})
export class ProductCardComponent implements OnInit {
  @Input({required:true}) producto!: Producto;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if (!this.producto) {
      console.error('❌ No se recibió producto');
      return;
    }

    // Log para depuración
    console.log('✅ Producto recibido:', {
      id: this.producto._id,
      nombre: this.producto.Nom_producto,
      usuario: this.producto.id_usuarios?.Nombre,
      imagenUsuario: this.producto.id_usuarios?.Imagen?.substring(0, 50),
      imagenProducto: this.producto.Imagen?.substring(0, 50)
    });
  }

  getImagenUsuario(): SafeUrl {
    const imagen = this.producto?.id_usuarios?.Imagen;
    
    if (!imagen || !imagen.startsWith('data:image')) {
      return '../../../assets/img/Perfil.jpeg';
    }

    return this.sanitizer.bypassSecurityTrustUrl(imagen);
  }

  getImagenProducto(): SafeUrl {
    const imagen = this.producto?.Imagen;
    
    if (!imagen || !imagen.startsWith('data:image')) {
      return '../../../assets/img/card.jpeg';
    }
    
    return this.sanitizer.bypassSecurityTrustUrl(imagen);
  }
}
