import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent,  
        IonAvatar, IonButton, IonIcon, IonCard, IonCardContent,
        IonList, IonItem, IonLabel, IonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/models/productos.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// Definir la interfaz para el elemento Swiper
interface SwiperContainer extends HTMLElement {
  initialize: () => void;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonAvatar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonText
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Necesario para los elementos personalizados de Swiper
})
export class PerfilPage implements OnInit {
  userProducts: Producto[] = [];
  userName: string = '';
  userImage: string = '';
  
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 'auto',
    spaceBetween: 25,  
    centeredSlides: false,
    loop: false,
    autoHeight: true,
    pagination: false,
    breakpoints: {
      // cuando la pantalla es más grande que 768px
      768: {
        spaceBetween: 30,  
      }
    }
  };

  constructor(
    private authService: AuthService,
    private productosService: ProductosService,
    private sanitizer: DomSanitizer
  ) {
    addIcons({ star });
  }

  ngOnInit() {
    // Obtener datos del usuario
    this.authService.getUsuarioNombre().subscribe(nombre => {
      this.userName = nombre;
    });

    // Obtener productos del usuario
    this.loadUserProducts();
  }

  getImagenUsuario(): SafeUrl {
    // Obtener el primer producto que tenga datos de usuario
    const usuarioConImagen = this.userProducts.find(p => p.id_usuarios?.Imagen);
    
    if (!usuarioConImagen?.id_usuarios?.Imagen) {
      console.log('No se encontró imagen de usuario, usando default');
      return '../../../assets/img/Perfil.jpeg';
    }

    console.log('Usando imagen de usuario:', usuarioConImagen.id_usuarios.Imagen.substring(0, 30) + '...');
    return this.sanitizer.bypassSecurityTrustUrl(usuarioConImagen.id_usuarios.Imagen);
  }

  getImagenProducto(producto: Producto): SafeUrl {
    if (!producto?.Imagen) {
      console.log('No se encontró imagen para el producto:', producto.Nom_producto);
      return '../../../assets/img/card.jpeg';
    }

    console.log('Usando imagen para producto:', producto.Nom_producto);
    return this.sanitizer.bypassSecurityTrustUrl(producto.Imagen);
  }

  async loadUserProducts() {
    try {
      const userId = await this.authService.getUsuarioIdPromise();
      if (userId) {
        this.productosService.getProductosByUserId(userId).subscribe(
          (productos: Producto[]) => {
            this.userProducts = productos;
            console.log('Productos cargados:', productos);
          },
          (error: Error) => {
            console.error('Error al cargar los productos:', error);
          }
        );
      }
    } catch (error: unknown) {
      console.error('Error al obtener el ID del usuario:', error);
    }
  }
}
