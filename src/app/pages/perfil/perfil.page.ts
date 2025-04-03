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
import { Router } from '@angular/router';

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
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilPage implements OnInit {
  userProducts: Producto[] = [];
  userName: string = '';
  userImage: string = '';
  private readonly CACHE_KEY = 'user_profile_data';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  
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
      768: {
        spaceBetween: 30,  
      }
    }
  };

  constructor(
    private authService: AuthService,
    private productosService: ProductosService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    addIcons({ star });
  }

  ngOnInit() {
    this.loadFromCache();
    this.loadUserData();
  }

  private loadFromCache() {
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < this.CACHE_DURATION) {
        console.log('📦 Cargando datos del perfil desde caché');
        this.userProducts = data.products;
        this.userName = data.name;
        this.userImage = data.image;
        return true;
      }
    }
    return false;
  }

  private saveToCache() {
    const cacheData = {
      data: {
        products: this.userProducts,
        name: this.userName,
        image: this.userImage
      },
      timestamp: Date.now()
    };
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Datos y productos del perfil guardados en caché');
  }

  private async loadUserData() {
    try {
      const userId = await this.authService.getUsuarioIdPromise();
      if (userId) {
        // Cargar nombre del usuario
        this.authService.getUsuarioNombre().subscribe(nombre => {
          this.userName = nombre;
          console.log('👤 Información del Usuario:');
          console.log('ID del usuario:', userId);
          console.log('Nombre del usuario:', nombre);
          this.saveToCache();
        });

        // Cargar productos y datos del usuario
        this.productosService.getProductosByUserId(userId).subscribe(
          (productos: Producto[]) => {
            this.userProducts = productos;
            
            // Actualizar imagen del usuario si está disponible
            const userWithImage = productos.find(p => p.id_usuarios?.Imagen);
            if (userWithImage?.id_usuarios?.Imagen) {
              this.userImage = userWithImage.id_usuarios.Imagen;
            }

            console.log('👤 Información completa del usuario:');
            console.log('ID del usuario:', userId);
            console.log('Nombre del usuario:', this.userName);
            console.log('Imagen del usuario:', this.userImage);
            console.log('📦 Productos del usuario:', productos.map(p => ({
              id: p.id,
              nombre: p.Nom_producto,
              imagen: p.Imagen,
              categoria: p.Categoria
            })));

            this.saveToCache();
          },
          (error: Error) => {
            console.error('❌ Error al cargar los productos:', error);
          }
        );
      }
    } catch (error: unknown) {
      console.error('❌ Error al obtener el ID del usuario:', error);
    }
  }

  getImagenUsuario(): SafeUrl {
    if (this.userImage) {
      return this.sanitizer.bypassSecurityTrustUrl(this.userImage);
    }

    const usuarioConImagen = this.userProducts.find(p => p.id_usuarios?.Imagen);
    if (usuarioConImagen?.id_usuarios?.Imagen) {
      this.userImage = usuarioConImagen.id_usuarios.Imagen;
      console.log('🖼️ Usando imagen de usuario:', this.userImage);
      return this.sanitizer.bypassSecurityTrustUrl(this.userImage);
    }

    console.log('🖼️ No se encontró imagen de usuario, usando default');
    return '../../../assets/img/Perfil.jpeg';
  }

  getImagenProducto(producto: Producto): SafeUrl {
    if (!producto?.Imagen) {
      return '../../../assets/img/card.jpeg';
    }
    return this.sanitizer.bypassSecurityTrustUrl(producto.Imagen);
  }

  editarPerfil() {
    this.router.navigate(['/configure-perfil']);
  }

  clearCache() {
    localStorage.removeItem(this.CACHE_KEY);
    this.loadUserData();
  }

  onCardClick(producto: Producto) {
    localStorage.setItem('selectedProduct', JSON.stringify(producto));
    this.router.navigate(['/detail-card']);
  }
}
