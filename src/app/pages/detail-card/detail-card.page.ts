import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, logoWhatsapp } from 'ionicons/icons';
import { Producto } from 'src/app/models/productos.model';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.page.html',
  styleUrls: ['./detail-card.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetailCardPage implements OnInit {
  producto: Producto | null = null;
  currentImage: string = '';
  dominantColor: string = '#00C2BA';
  secondaryColor: string = '#F7B495';

  constructor() {
    addIcons({ star, logoWhatsapp });
  }

  ngOnInit() {
    this.loadProductData();
  }

  private loadProductData() {
    // Cargar datos del producto desde localStorage
    const savedProduct = localStorage.getItem('selectedProduct');
    if (savedProduct) {
      this.producto = JSON.parse(savedProduct);
      this.currentImage = this.producto?.Imagen || '../../../assets/img/card.jpeg';
      console.log('Producto cargado:', this.producto);
    } else {
      console.error('No se encontró producto seleccionado');
    }
  }

  getImagenUsuario(): string {
    return this.producto?.id_usuarios?.Imagen || '../../../assets/img/Perfil.jpeg';
  }

  getNombreUsuario(): string {
    return this.producto?.id_usuarios?.Nombre || 'Usuario';
  }

  abrirWhatsApp() {
    if (this.producto?.Numero_telefonico) {
      // Formatear mensaje
      const mensaje = `Hola, me interesa tu producto "${this.producto.Nom_producto}" que vi en REVEO.`;
      const url = `https://wa.me/${this.producto.Numero_telefonico}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    } else {
      console.error('No hay número telefónico disponible');
      // Aquí podrías mostrar un toast o alerta al usuario
    }
  }
}
