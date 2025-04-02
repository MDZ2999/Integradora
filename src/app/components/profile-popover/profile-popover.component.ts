import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonLabel,
  PopoverController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personCircleOutline,
  logOutOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile-popover',
  template: `
    <ion-content>
      <ion-list>
        <ion-item button (click)="goToProfile()">
          <ion-icon name="person-circle-outline"></ion-icon>
          <ion-label>Mi Perfil</ion-label>
        </ion-item>
        <ion-item button (click)="logout()">
          <ion-icon name="log-out-outline"></ion-icon>
          <ion-label>Cerrar Sesión</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel
  ]
})
export class ProfilePopoverComponent {
  constructor(private popoverCtrl: PopoverController) {
    addIcons({
      personCircleOutline,
      logOutOutline
    });
  }

  goToProfile() {
    this.popoverCtrl.dismiss('profile');
  }

  logout() {
    this.popoverCtrl.dismiss('logout');
  }
}
