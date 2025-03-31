import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, cloudUploadOutline } from 'ionicons/icons';

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
    confirmarContrasena: '',
    Imagen: {
      nombre: '',
      contenido: ''
    }
  };

  fileName: string = '';
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({arrowBackOutline, cloudUploadOutline});
  }

  goToLogin() {
    this.router.navigate(['/login']);
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

  openFileInput() {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      this.usuario.Imagen.nombre = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.usuario.Imagen.contenido = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async register() {
    try {
      // Validar campos requeridos
      if (!this.usuario.Nombre || !this.usuario.Apellido_paterno || 
          !this.usuario.Apellido_materno || !this.usuario.Correo || 
          !this.usuario.Contrasena || !this.usuario.confirmarContrasena) {
        await this.presentAlert('Error', 'Por favor, complete todos los campos');
        return;
      }

      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.usuario.Correo)) {
        await this.presentAlert('Error', 'Por favor, ingrese un correo válido');
        return;
      }

      // Validar longitud de contraseña
      if (this.usuario.Contrasena.length < 6) {
        await this.presentAlert('Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
      }

      // Validar coincidencia de contraseñas
      if (this.usuario.Contrasena !== this.usuario.confirmarContrasena) {
        await this.presentAlert('Error', 'Las contraseñas no coinciden');
        return;
      }

      // Crear FormData
      const formData = new FormData();
      formData.append('Nombre', this.usuario.Nombre);
      formData.append('Apellido_paterno', this.usuario.Apellido_paterno);
      formData.append('Apellido_materno', this.usuario.Apellido_materno);
      formData.append('Correo', this.usuario.Correo.toLowerCase());
      formData.append('Contrasena', this.usuario.Contrasena);

      // Convertir base64 a Blob si hay imagen
      if (this.usuario.Imagen.contenido) {
        const base64Data = this.usuario.Imagen.contenido.split(',')[1];
        const blob = this.base64toBlob(base64Data, 'image/jpeg');
        formData.append('Imagen', blob, this.usuario.Imagen.nombre);
      }

      const response = await this.authService.register(formData).toPromise();
      await this.presentAlert('¡Éxito!', 'Usuario registrado exitosamente', true);
      this.router.navigate(['/login']);
    } catch (error: any) {
      await this.presentAlert('Error', error.error?.message || 'Error al registrar usuario');
    }
  }

  private base64toBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  onRegisterClick(form: any) {
    form.form.markAllAsTouched();
    if (form.valid) {
      this.register();
    }
  }
}
