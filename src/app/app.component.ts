import { Component, OnInit } from '@angular/core';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  reorderThreeOutline, 
  heartOutline,
  cubeOutline,
  personCircle,
  logOutOutline,
  pencilOutline,
  desktopOutline, 
  appsOutline, 
  schoolOutline, 
  shirtOutline, 
  bookOutline, 
  hardwareChipOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet
  ],
})
export class AppComponent implements OnInit {
  private menuOpened = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService,
    private menuCtrl: MenuController
  ) {
    addIcons({ 
      reorderThreeOutline,
      heartOutline,
      cubeOutline,
      personCircle,
      logOutOutline,
      pencilOutline,
      desktopOutline, 
      apps: appsOutline, 
      schoolOutline, 
      shirtOutline, 
      bookOutline, 
      hardwareChipOutline 
    });
  }

  ngOnInit() {
    // Escuchar eventos del menú de categorías
    const categoryMenu = document.querySelector('ion-menu[menuId="home-categories-menu"]');
    if (categoryMenu) {
      categoryMenu.addEventListener('ionDidOpen', () => {
        this.menuOpened = true;
      });

      categoryMenu.addEventListener('ionDidClose', () => {
        if (this.menuOpened) {
          // Solo resetear si el menú se cerró sin seleccionar una categoría
          this.categoryService.setCategory('');
          this.menuOpened = false;
        }
      });
    }
  }

  goToDonaciones() {
    this.menuCtrl.close('home-toolbar-menu');
    this.router.navigate(['/donaciones']);
  }

  goToBaul() {
    this.menuCtrl.close('home-toolbar-menu');
    this.router.navigate(['/baul']);
  }

  goToProfile() {
    this.menuCtrl.close('home-toolbar-menu');
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.menuCtrl.close('home-toolbar-menu');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async onCategorySelect(categoria: string) {
    this.menuOpened = false; // Indicar que se seleccionó una categoría
    
    // Primero establecer la categoría
    this.categoryService.setCategory(categoria);
    
    // Luego cerrar el menú
    await this.menuCtrl.close('home-categories-menu');
  }
}
