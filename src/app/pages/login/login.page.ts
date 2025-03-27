import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCol, IonTitle, IonInput, IonItem, IonList, IonCard, IonCardContent,
  IonRow, IonIcon, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonRow, IonCol, IonCardContent, IonCard, IonList, IonItem, IonInput, IonContent,
    IonTitle, CommonModule, FormsModule, IonButton]
})
export class LoginPage implements OnInit {
  correo: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.correo || !this.contrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos',
        backdrop: false
      });
      return;
    }

    this.authService.login(this.correo.toLowerCase(), this.contrasena.toLowerCase()).subscribe({
      next: (response) => {
        // Guardar estado de sesión
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('usuarioId', response.usuario.id);
        localStorage.setItem('usuarioNombre', response.usuario.nombre);
        this.authService.updateSessionState(true, response.usuario.nombre);

        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Redirigiendo...',
          timer: 2000,
          showConfirmButton: false,
          backdrop: false
        }).then(() => {
          this.router.navigate(['/home']);
        });
      },
      error: (error) => {
        let mensaje = 'Ocurrió un error inesperado';

        if (error.status === 400 || error.status === 401) {
          mensaje = 'Correo o contraseña incorrectos';
        } else if (error.status === 500) {
          mensaje = 'Error al iniciar sesión';
        } else if (error.error?.message) {
          mensaje = error.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          backdrop: false
        });
      }
    });
  }

  ngOnInit() {
  }
}
