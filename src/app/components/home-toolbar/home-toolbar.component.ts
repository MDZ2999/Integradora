import { Component, OnInit } from '@angular/core';
import { IonSearchbar, IonToolbar, IonContent, IonButtons, IonMenuButton, IonButton,
  IonIcon, IonLabel, IonItem, IonMenu, IonList, MenuController} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, heartOutline, personCircle, searchOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-toolbar',
  templateUrl: './home-toolbar.component.html',
  styleUrls: ['./home-toolbar.component.scss'],
  imports: [IonToolbar, IonContent, IonButtons, IonMenuButton, IonButton,
      IonIcon, IonLabel, IonSearchbar, IonItem, IonMenu, IonList],
})
export class HomeToolbarComponent  implements OnInit {

  constructor(private menuCtrl: MenuController,  private router: Router) {
      addIcons({personCircle, searchOutline, cubeOutline, heartOutline});
    }

  ngOnInit() {}

  onClick() {
    console.log('Menu clicked');
    this.menuCtrl.open('home-toolbar-menu');  // Esto abrirá o cerrará el menú de la barra de herramientas
  }

  goToBaul() {
    console.log('Baul clicked');
    this.router.navigate(['/baul']);
  }

  goToDonaciones() {
    console.log('Donaciones clicked');
    this.router.navigate(['/donaciones']);
  }

}
