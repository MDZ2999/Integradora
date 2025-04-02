import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeToolbarComponent } from '../components/home-toolbar/home-toolbar.component';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { IonicModule, MenuController, IonMenu, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductosService } from '../services/productos.service';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { addIcons } from 'ionicons';
import { 
  reorderThreeOutline, 
  heart, 
  pencilOutline, 
  desktopOutline, 
  appsOutline, 
  schoolOutline, 
  shirtOutline, 
  bookOutline, 
  hardwareChipOutline 
} from 'ionicons/icons';
import { Observable, Subscription } from 'rxjs';
import { Producto } from '../models/productos.model';
import { SearchService } from '../services/search.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HomeToolbarComponent,
    ProductCardComponent
  ]
})
export class HomePage implements OnInit, OnDestroy {
  productos: Producto[] = [];
  todosLosProductos: Producto[] = [];
  showSubcategories = false;
  categoriaSeleccionada: string = '';
  isLoggedIn$: Observable<boolean>;
  private searchTerm = '';
  isSmallScreen = false;
  private subscriptions: Subscription[] = [];
  private lastCategorySelected = '';

  @ViewChild('categoryMenu') categoryMenu!: IonMenu;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private productosService: ProductosService,
    private authService: AuthService,
    private searchService: SearchService,
    private categoryService: CategoryService,
    private platform: Platform
  ) {
    addIcons({ 
      reorderThreeOutline, 
      heart, 
      pencilOutline, 
      desktopOutline, 
      apps: appsOutline, 
      schoolOutline, 
      shirtOutline, 
      bookOutline, 
      hardwareChipOutline
    });
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.isSmallScreen = window.innerWidth < 768;

    // Suscribirse a cambios en el término de búsqueda
    this.subscriptions.push(
      this.searchService.searchTerm$.subscribe(term => {
        this.searchTerm = term;
        this.aplicarFiltros();
      })
    );

    // Suscribirse a cambios en la categoría
    this.subscriptions.push(
      this.categoryService.category$.subscribe(categoria => {
        if (categoria !== this.categoriaSeleccionada) {
          this.categoriaSeleccionada = categoria;
          this.lastCategorySelected = categoria;
          this.filtrarPorCategoria(categoria);
        }
      })
    );

    // Cargar productos iniciales
    this.cargarProductos();

    // Detectar cambios en el tamaño de la pantalla
    window.addEventListener('resize', () => {
      this.isSmallScreen = window.innerWidth < 768;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallScreen = window.innerWidth < 768;
  }

  async toggleSubcategories() {
    if (this.isSmallScreen) {
      await this.menuCtrl.toggle('home-categories-menu');
    } else {
      this.showSubcategories = !this.showSubcategories;
      if (!this.showSubcategories) {
        this.categoryService.setCategory('');
      }
    }
  }

  async onCategorySelect(categoria: string | null) {
    if (categoria === null) {
      categoria = '';
    }
    
    // Solo actualizar si la categoría es diferente
    if (categoria !== this.categoriaSeleccionada) {
      this.categoryService.setCategory(categoria);
      
      // Cerrar el menú después de seleccionar una categoría
      const activeMenu = await this.menuCtrl.getOpen();
      if (activeMenu) {
        await this.menuCtrl.close(activeMenu.menuId);
      }
    }
  }

  async filtrarPorCategoria(categoria: string) {
    if (categoria === '') {
      await this.cargarProductos();
    } else {
      const productos = await this.productosService.getProductosConUsuarios().toPromise();
      if (productos) {
        this.productos = productos.filter(p => 
          p.Categoria?.toLowerCase() === categoria.toLowerCase()
        );
      }
    }
  }

  async cargarProductos() {
    try {
      const productos = await this.productosService.getProductosConUsuarios().toPromise();
      if (productos) {
        this.productos = productos;
        this.todosLosProductos = productos;
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  goToPublish() {
    this.router.navigate(['/publish']);
  }

  private async aplicarFiltros() {
    const productos = await this.productosService.getProductosConUsuarios().toPromise();
    let productosFiltrados = productos || [];

    // Aplicar filtro de categoría si hay una seleccionada
    if (this.categoriaSeleccionada && this.categoriaSeleccionada !== '') {
      productosFiltrados = productosFiltrados.filter(
        producto => producto.Categoria?.toLowerCase() === this.categoriaSeleccionada.toLowerCase()
      );
    }

    // Aplicar filtro de búsqueda si hay un término
    const searchTerm = await new Promise<string>(resolve => {
      this.searchService.searchTerm$.pipe(take(1)).subscribe(term => {
        resolve((term || '').toLowerCase());
      });
    });

    if (searchTerm) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.Nom_producto.toLowerCase().includes(searchTerm) ||
        producto.Descripcion?.toLowerCase().includes(searchTerm)
      );
    }

    this.productos = productosFiltrados;
  }
}
