import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonSearchbar, 
  IonMenuButton, 
  IonLabel, 
  IonContent, 
  IonItem, 
  IonList, 
  IonMenu, 
  MenuController,
  PopoverController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { addIcons } from 'ionicons';
import { 
  cubeOutline, 
  heartOutline, 
  logInOutline, 
  logOutOutline, 
  personAddOutline, 
  personCircle, 
  personCircleOutline, 
  searchOutline 
} from 'ionicons/icons';
import { ProfilePopoverComponent } from '../profile-popover/profile-popover.component';

@Component({
  selector: 'app-home-toolbar',
  templateUrl: './home-toolbar.component.html',
  styleUrls: ['./home-toolbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonSearchbar, 
    IonMenuButton, 
    IonLabel, 
    IonContent,
    IonItem,
    IonList,
    IonMenu,
    ProfilePopoverComponent
  ]
})
export class HomeToolbarComponent {
  isLoggedIn$: Observable<boolean>;
  usuarioNombre$: Observable<string>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private searchService: SearchService,
    private menuCtrl: MenuController,
    private popoverCtrl: PopoverController
  ) {
    addIcons({
      personCircle, 
      searchOutline, 
      cubeOutline, 
      heartOutline, 
      logInOutline, 
      personAddOutline,
      logOutOutline, 
      personCircleOutline
    });
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.usuarioNombre$ = this.authService.getUsuarioNombre();
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.searchService.updateSearchTerm(term);
  }

  async openPopover(e: any) {
    const popover = await this.popoverCtrl.create({
      component: ProfilePopoverComponent,
      event: e,
      translucent: true
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data === 'profile') {
      this.goToProfile();
    } else if (data === 'logout') {
      this.logout();
    }
  }

  onClick() {
    this.menuCtrl.toggle('home-toolbar-menu');
  }

  goToProfile() {
    this.menuCtrl.close('home-toolbar-menu');
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.menuCtrl.close('home-toolbar-menu');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToDonaciones() {
    this.menuCtrl.close('home-toolbar-menu');
    this.router.navigate(['/donaciones']);
  }

  goToBaul() {
    this.menuCtrl.close('home-toolbar-menu');
    this.router.navigate(['/baul']);
  }

  goToLogin() {
    this.menuCtrl.close('home-toolbar-menu');
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.menuCtrl.close('home-toolbar-menu');
    this.router.navigate(['/register']);
  }
}
