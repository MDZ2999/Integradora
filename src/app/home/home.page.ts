import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { HomeToolbarComponent } from '../components/home-toolbar/home-toolbar.component';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { IonContent, IonButton, IonIcon, IonLabel, IonItem, IonMenu, IonList, MenuController, IonToolbar, IonButtons, IonGrid, IonRow, IonCol, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, reorderThreeOutline} from 'ionicons/icons';
import { Router } from '@angular/router';
import { ProductosService } from '../services/productos.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Producto } from '../models/productos.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonMenu,
    IonList,
    IonToolbar,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    HomeToolbarComponent,
    ProductCardComponent
  ]
})
export class HomePage implements OnInit {
  isLoggedIn$: Observable<boolean>;
  showSubcategories = false;
  isSmallScreen = window.innerWidth < 768;
  productos: Producto[] = [];

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private productosService: ProductosService,
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
        console.log('Datos recibidos del servidor:', data);
        this.productos = data;
        console.log('Productos cargados exitosamente:', this.productos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
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
