import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-donaciones',
  templateUrl: './donaciones.page.html',
  styleUrls: ['./donaciones.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule]
})
export class DonacionesPage implements OnInit {
  isLeaving = false;
  constructor(private navCtrl: NavController) {
    addIcons({arrowBackOutline});
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
