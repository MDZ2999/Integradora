import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent,  
         IonAvatar, IonButton, IonIcon, IonCard, 
         IonList, IonItem, IonLabel, IonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

// Definir la interfaz para el elemento Swiper
interface SwiperContainer extends HTMLElement {
  initialize: () => void;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonAvatar,
    IonButton,
    IonIcon,
    IonCard,
    IonList,
    IonItem,
    IonLabel,
    IonText
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Necesario para los elementos personalizados de Swiper
})
export class PerfilPage implements OnInit {
  
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 'auto',
    spaceBetween: 25,  
    centeredSlides: false,
    loop: false,
    autoHeight: true,
    pagination: false,
    breakpoints: {
      // cuando la pantalla es más grande que 768px
      768: {
        spaceBetween: 30,  
      }
    }
  };

  constructor() {
    addIcons({ star });
  }

  ngOnInit() {
    // Inicializar Swiper con las opciones
    const swiperEl = document.querySelector('swiper-container') as SwiperContainer;
    if (swiperEl) {
      // Asignar las opciones directamente como propiedades
      swiperEl.setAttribute('slides-per-view', 'auto');
      swiperEl.setAttribute('space-between', '25');  
      swiperEl.setAttribute('centered-slides', 'false');
      swiperEl.setAttribute('loop', 'false');
      
      // Inicializar el swiper
      swiperEl.initialize();
    }
  }
}
