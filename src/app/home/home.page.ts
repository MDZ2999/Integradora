import { Component, HostListener, OnInit } from '@angular/core';
import { HomeToolbarComponent } from '../components/home-toolbar/home-toolbar.component';
import { IonContent, IonButton, IonIcon, IonLabel, IonItem, IonMenu, IonList, MenuController, IonToolbar, IonButtons, IonGrid, IonRow, IonCol, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, reorderThreeOutline} from 'ionicons/icons';
import { Router } from '@angular/router';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { ProductosService } from '../services/productos.service';
import { Producto } from '../models/productos.model';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonCol, IonRow, IonGrid, IonButtons, IonToolbar, IonContent, IonButton, IonIcon, IonLabel,
    IonItem, IonMenu, IonList, AsyncPipe, HomeToolbarComponent, ProductCardComponent],
  standalone: true
})
export class HomePage implements OnInit {
  isLoggedIn$: Observable<boolean>;
  showSubcategories = false;
  isSmallScreen = window.innerWidth < 768;
  productos: Producto[] = [];

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private productosService: ProductosService, // Inyectar el servicio
    private authService: AuthService,
  ) {
    addIcons({ reorderThreeOutline, heart });
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productosService.getProductosConUsuarios().subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          console.warn('No se encontraron productos');
          return;
        }
        
        this.productos = data.map(producto => ({
          ...producto,
          Imagen: this.convertirImagen(producto.Imagen) ?? '../../../assets/img/card.jpeg',
          id_usuarios: {
            ...producto.id_usuarios,
            Imagen: this.convertirImagen(producto.id_usuarios?.Imagen) ?? '../../../assets/img/Perfil.jpeg'
          }
        })) as Producto[];

        console.log('Productos cargados exitosamente:', this.productos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        // Aquí podrías mostrar un mensaje al usuario usando un toast o alert
      }
    });
  }

  // Función para convertir imagen de Buffer a Base64
  convertirImagen(imagen: any): string | undefined {
    if (!imagen) return undefined; // Si no hay imagen, devolver `undefined`

    // Si la imagen ya tiene una URL, retornarla sin modificar
    if (typeof imagen === 'object' && 'url' in imagen) {
      return imagen.url;
    }

    // Si la imagen es un Buffer, convertirla a base64
    if (imagen.data instanceof ArrayBuffer) {
      let binary = '';
      const bytes = new Uint8Array(imagen.data);
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }

    return undefined;
  }

  toggleCategories() {
    console.log("Categories Clicked", this.isSmallScreen);
    if (this.isSmallScreen) {
      this.menuCtrl.open('category-menu');
    } else {
      // Si la pantalla es grande, solo cambia el estado de la subcategoría
      this.showSubcategories = !this.showSubcategories;
    }
  }

  goToPublish(){
    console.log("Donar Clicked");
    this.router.navigate(['/publish']);
  }
}
