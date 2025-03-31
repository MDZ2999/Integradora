import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  correo: string = '';
  contrasena: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLoginClick(form: any) {
    form.form.markAllAsTouched();
    if (form.valid) {
      this.login();
    }
  }

  async presentAlert(header: string, message: string, isSuccess: boolean = false) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: isSuccess ? 'success-alert' : 'error-alert'
    });
    await alert.present();
  }

  async login() {
    if (!this.correo || !this.contrasena) {
      await this.presentAlert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      const response = await this.authService.login(this.correo.toLowerCase(), this.contrasena).toPromise();
      
      if (response) {
        //Guardar estado de sesion
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(response.usuario));
        localStorage.setItem('usuarioId', response.usuario.id);
        localStorage.setItem('usuarioNombre', response.usuario.nombre);
        this.authService.updateSessionState(true, response.usuario.nombre, response.token);

        await this.presentAlert('¡Éxito!', 'Inicio de sesión exitoso', true);
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      await this.presentAlert(
        'Error', 
        error.error?.message || 'Error al iniciar sesión'
      );
    }
  }
}
