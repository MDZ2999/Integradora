import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage {
  usuario = {
    Nombre: '',
    Apellido_paterno: '',
    Apellido_materno: '',
    Correo: '',
    Contrasena: '',
    confirmarContrasena: ''
  };
  
  fileName: string = '';
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  openFileInput() {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  register() {
    if (!this.validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('Nombre', this.usuario.Nombre);
    formData.append('Apellido_paterno', this.usuario.Apellido_paterno);
    formData.append('Apellido_materno', this.usuario.Apellido_materno);
    formData.append('Correo', this.usuario.Correo);
    formData.append('Contrasena', this.usuario.Contrasena);
    
    if (this.selectedFile) {
      formData.append('Imagen', this.selectedFile);
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada correctamente',
          icon: 'success',
          backdrop: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        console.error('Error completo:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'Error al registrar usuario',
          icon: 'error',
          backdrop: false
        });
      }
    });
  }

  onRegisterClick(form: any) {
    form.form.markAllAsTouched();
    if (form.valid) {
      this.register();
    }
  }

  private validateForm(): boolean {
    if (!this.usuario.Nombre || !this.usuario.Apellido_paterno || !this.usuario.Apellido_materno || 
        !this.usuario.Correo || !this.usuario.Contrasena || !this.usuario.confirmarContrasena) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos',
        icon: 'error',
        backdrop: false
      });
      return false;
    }

    if (this.usuario.Contrasena !== this.usuario.confirmarContrasena) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        backdrop: false
      });
      return false;
    }

    return true;
  }
}
