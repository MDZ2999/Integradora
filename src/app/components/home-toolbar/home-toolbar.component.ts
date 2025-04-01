import { Component, OnInit } from '@angular/core';
import { IonSearchbar, IonToolbar, IonContent, IonButtons, IonMenuButton, IonButton,
  IonIcon, IonLabel, IonItem, IonMenu, IonList, MenuController, IonPopover } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, heartOutline, logInOutline, logOutOutline, personAddOutline, personCircle, 
  personCircleOutline, searchOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-toolbar',
  templateUrl: './home-toolbar.component.html',
  styleUrls: ['./home-toolbar.component.scss'],
  standalone: true,
  imports: [IonPopover, IonToolbar, IonContent, IonButtons, IonMenuButton, IonButton, IonIcon, IonLabel,
    IonSearchbar, IonItem, IonMenu, IonList, CommonModule],
})
export class HomeToolbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isPopoverOpen = false;
  usuarioNombre$: Observable<string>;
  popoverEvent: any;

  constructor(private menuCtrl: MenuController, private router: Router, private authService: AuthService) {
    addIcons({
      personCircle, searchOutline, cubeOutline, heartOutline, logInOutline, personAddOutline,
      logOutOutline, personCircleOutline
    });
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.usuarioNombre$ = this.authService.getUsuarioNombre();
  }

  ngOnInit() {
  }

  onClick() {
    console.log('Menu clicked');
    this.menuCtrl.open('home-toolbar-menu');  
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

  openPopover(ev: Event) {
    this.popoverEvent = ev;
    this.isPopoverOpen = true;
  }

  // Redirigir a la página de perfil y cerrar menús
  async goToProfile() {
    this.isPopoverOpen = false;
    await this.menuCtrl.close('home-toolbar-menu');
    this.router.navigate(['/perfil']);
  }

  // Cerrar sesión
  async logout() {
    this.isPopoverOpen = false;
    await this.menuCtrl.close('home-toolbar-menu');
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
