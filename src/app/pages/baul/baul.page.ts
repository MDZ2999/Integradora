import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonIcon, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-baul',
  templateUrl: './baul.page.html',
  styleUrls: ['./baul.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, FormsModule],
})
export class BaulPage implements OnInit {
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
