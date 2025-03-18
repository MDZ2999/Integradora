import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonTextarea, IonInput, IonRow, IonGrid, IonCol, IonList, IonSelect, IonSelectOption, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.page.html',
  styleUrls: ['./publish.page.scss'],
  standalone: true,
  imports: [IonIcon, IonList, IonCol, IonGrid, IonRow, IonInput, IonTextarea, IonLabel, IonItem, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelect, IonSelectOption]
})
export class PublishPage implements OnInit {

  constructor() {
    addIcons({ cloudUploadOutline });
  }

  ngOnInit() {
  }

}
