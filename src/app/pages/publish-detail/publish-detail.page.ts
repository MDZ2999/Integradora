import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTextarea, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-publish-detail',
  templateUrl: './publish-detail.page.html',
  styleUrls: ['./publish-detail.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonTextarea, IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, CommonModule, FormsModule]
})
export class PublishDetailPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
