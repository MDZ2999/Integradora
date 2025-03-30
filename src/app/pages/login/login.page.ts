import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  constructor(private authService: AuthService, private router: Router) {}

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

  login() {
    if (!this.correo || !this.contrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos',
        backdrop: false
      });
      return;
    }

    this.authService.login(this.correo.toLowerCase(), this.contrasena).subscribe({
      next: (response) => {
        //Guardar estado de sesion
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(response));
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message || 'Error al iniciar sesión',
        });
      }
    });
  }
}
