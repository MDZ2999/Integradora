import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { IonContent, IonCol, IonTitle, IonInput, IonItem, IonList, IonCard, IonCardContent,
  IonRow} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonCardContent, IonCard, IonList, IonItem, IonInput, IonContent,
    IonTitle, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  correo: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.contrasena);

    if (!this.correo || !this.contrasena) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (response) => {
        // Guardar estado de sesión
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('usuarioId', response.usuarioId);
        localStorage.setItem('usuarioNombre', response.nombre);
        this.authService.updateSessionState(true, response.nombre);

        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Redirigiendo...',
          timer: 2000,  // Tiempo antes de redirigir
          showConfirmButton: false,
          backdrop: false  // Evita que la pantalla se oscurezca completamente
        }).then(() => {
          window.location.href = '/home';  // O la ruta de tu página home
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
