import { Component, OnInit, Input } from '@angular/core';
import { IonCard } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

interface Usuario {
  _id: string;
  Nombre: string;
  Imagen?: string;  // Hacemos Imagen opcional para que coincida con el modelo
}

interface Productos {
  _id: string;
  Nom_producto: string;
  id_usuarios: Usuario; 
  Imagen?: string;  // Hacemos Imagen opcional para que coincida con el modelo
}

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [IonCard, CommonModule],
  standalone: true
})
export class ProductCardComponent implements OnInit {
  @Input({required:true}) producto!: Productos;

  constructor() { }

  ngOnInit() {
    if (!this.producto) {
      console.error('❌ Producto no recibido en ProductCardComponent');
    } else {
      console.log('✅ Producto recibido en ProductCardComponent:', this.producto);
    }
  }
}
