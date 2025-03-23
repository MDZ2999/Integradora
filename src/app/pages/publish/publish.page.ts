import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, arrowBackOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.page.html',
  styleUrls: ['./publish.page.scss'],
  standalone: true,
  imports: [IonIcon, IonInput, IonLabel, IonItem, IonButton, IonContent, CommonModule, FormsModule, IonSelect,
  IonSelectOption],
})
export class PublishPage implements OnInit {
  isLeaving = false;

  constructor(private navCtrl: NavController) {
    addIcons({arrowBackOutline,cloudUploadOutline});
  }

  ngOnInit() {
  }

  goBack() {
    this.isLeaving = true; // Activa la animación de salida
    setTimeout(() => {
      this.navCtrl.back(); // Navega después de la animación
    }, 500);
  }
}
