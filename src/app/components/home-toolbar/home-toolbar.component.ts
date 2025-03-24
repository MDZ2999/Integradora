import { Component, OnInit } from '@angular/core';
import { IonSearchbar, IonToolbar, IonContent, IonButtons, IonMenuButton, IonButton,
  IonIcon, IonLabel, IonItem, IonMenu, IonList, MenuController} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, heartOutline, logInOutline, personAddOutline, personCircle, searchOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-toolbar',
  templateUrl: './home-toolbar.component.html',
  styleUrls: ['./home-toolbar.component.scss'],
  imports: [IonToolbar, IonContent, IonButtons, IonMenuButton, IonButton,
      IonIcon, IonLabel, IonSearchbar, IonItem, IonMenu, IonList, CommonModule],
})
export class HomeToolbarComponent  implements OnInit {
  isLoggedIn$ = this.authService.isLoggedIn;

  constructor(private menuCtrl: MenuController,  private router: Router, private authService: AuthService) {
      addIcons({personCircle, searchOutline, cubeOutline, heartOutline, logInOutline,personAddOutline });
    }

  ngOnInit() {}

  onClick() {
    console.log('Menu clicked');
    this.menuCtrl.open('home-toolbar-menu');  // Esto abrirá o cerrará el menú de la barra de herramientas
  }

  goToBaul() {
    console.log('Baul clicked');
    this.router.navigate(['/baul']);
  }

  goToDonaciones() {
    console.log('Donaciones clicked');
    this.router.navigate(['/donaciones']);
  }

  goToLogin() {
    console.log('Iniciar Sesion clicked');
    this.router.navigate(['/login']);
  }

  goToRegister() {
    console.log('Registrarse clicked');
    this.router.navigate(['/register']);
  }

}
