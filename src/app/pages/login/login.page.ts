import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCol, IonTitle, IonToolbar, IonButton, IonInput,
  IonItem, IonList, IonCard, IonCardContent, IonRow, IonLabel, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonRow, IonCol, IonCardContent, IonCard, IonList, IonItem,
  IonInput, IonButton, IonContent, IonTitle, IonToolbar, CommonModule,
  FormsModule]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
