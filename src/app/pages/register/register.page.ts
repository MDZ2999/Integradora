import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard,
  IonIcon,IonCardContent, IonItem, IonInput, IonRow, IonCol, IonButton, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonLabel, IonButton, IonCol, IonRow, IonInput, IonItem, IonCardContent,
    IonIcon, IonCard, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {

  constructor() {
    addIcons({cloudUploadOutline});
  }

  openFileInput() {
    document.getElementById('fileInput')?.click();
  }

  ngOnInit() {
  }

}
