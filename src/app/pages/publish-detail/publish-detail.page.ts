import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTextarea, IonItem, IonLabel, IonButton, 
  IonSelect, IonSelectOption, IonInput, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

@Component({
  selector: 'app-publish-detail',
  templateUrl: './publish-detail.page.html',
  styleUrls: ['./publish-detail.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonLabel, IonItem, IonTextarea, IonContent, IonHeader, IonTitle, 
    IonToolbar, IonSelect, IonSelectOption, CommonModule, FormsModule, IonIcon]
})
export class PublishDetailPage implements OnInit {
  isLeaving = false;

  constructor(private navCtrl: NavController) {
    addIcons({arrowBackOutline});
   }

  ngOnInit() {
  }

  goBack() {
    this.isLeaving = true; // Activa la animación de salida en la página actual

    // Navega después de la duración de la animación
    setTimeout(() => {
      this.navCtrl.back();
    }, 500); // Espera 0.5s (duración de la animación)
  }
}
