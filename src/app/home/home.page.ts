import { Component, HostListener } from '@angular/core';
import { HomeToolbarComponent } from '../components/home-toolbar/home-toolbar.component';
import { IonContent, IonButton, IonIcon, IonLabel, IonItem, IonMenu, IonList, MenuController, IonToolbar, IonButtons, IonGrid, IonRow, IonCol, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, reorderThreeOutline} from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonCard, IonCol, IonRow, IonGrid, IonButtons, IonToolbar, IonContent, IonButton, IonIcon, IonLabel, IonItem, IonMenu, IonList, HomeToolbarComponent],
})
export class HomePage {
  showSubcategories = false;
  isSmallScreen = window.innerWidth < 768;

  constructor(private menuCtrl: MenuController, private router: Router) {
    addIcons({reorderThreeOutline, heart});
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }

  toggleCategories() {
    console.log("Categories Clicked", this.isSmallScreen); // Asegúrate de que este log aparece
    if (this.isSmallScreen) {
      this.menuCtrl.open('category-menu'); // Abre o cierra el menú lateral de categorías
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
