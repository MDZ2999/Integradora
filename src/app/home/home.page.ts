import { Component } from '@angular/core';
import { IonHeader, IonSearchbar, IonToolbar, IonTitle, IonContent, IonAvatar, IonButtons, IonMenuButton, IonButton,
  IonIcon, IonLabel, IonCard, IonItem, IonMenu, IonList} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, heartOutline, personCircle, reorderThreeOutline, searchOutline } from 'ionicons/icons';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonButtons, IonMenuButton, IonButton,
    IonIcon, IonLabel, IonCard, IonSearchbar, IonItem, IonMenu, IonList],
})
export class HomePage {
  showSubcategories = false;

  constructor(private menu: MenuController) {
    addIcons({personCircle, searchOutline, cubeOutline, heartOutline, reorderThreeOutline});
  }

  toggleCategories() {
    this.showSubcategories = !this.showSubcategories;
  }
}
