import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonTextarea, IonInput, IonRow, IonGrid, IonCol, IonList, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.page.html',
  styleUrls: ['./publish.page.scss'],
  standalone: true,
  imports: [IonList, IonCol, IonGrid, IonRow, IonInput, IonTextarea, IonLabel, IonItem, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelect, IonSelectOption]
})
export class PublishPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
