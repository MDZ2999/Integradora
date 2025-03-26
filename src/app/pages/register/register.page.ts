import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonList, IonCard,
  IonIcon,IonCardContent, IonItem, IonInput, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [ IonCol, IonRow, IonInput, IonItem, IonCardContent,RouterLink,
    IonIcon, IonCard, IonList, IonContent, IonTitle, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {
  fileName: string = ''; // Variable para almacenar el nombre del archivo seleccionado

  constructor() {
    addIcons({cloudUploadOutline});
  }
  openFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click(); // Abre el selector de archivos
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name; // Actualiza el nombre del archivo en el campo
    }
  }

  ngOnInit() {
  }

}
