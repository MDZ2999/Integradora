import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonTitle, IonList, IonCard, 
  IonIcon, IonCardContent, IonItem, IonInput, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [ IonCol, IonRow, IonInput, IonItem, IonCardContent, RouterLink, 
    IonIcon, IonCard, IonList, IonContent, IonTitle, CommonModule, FormsModule, IonButton ]
})
export class RegisterPage implements OnInit {
  fileName: string = '';
  selectedFile: File | null = null;
  usuario = {
    Nombre: '',
    Apellido_paterno: '',
    Apellido_materno: '',
    Correo: '',
    Contrasena: '',
    confirmarContrasena: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({cloudUploadOutline});
  }

  openFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
      this.selectedFile = file;
    }
  }

  async onSubmit() {
    if (!this.usuario.Nombre || !this.usuario.Apellido_paterno || !this.usuario.Correo || !this.usuario.Contrasena) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos requeridos',
        backdrop: false
      });
      return;
    }

    if (this.usuario.Contrasena !== this.usuario.confirmarContrasena) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contrasenas no coinciden',
        backdrop: false
      });
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
      next: async (response) => {
        await Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Redirigiendo al inicio de sesion...',
          timer: 2000,
          showConfirmButton: false,
          backdrop: false
        });
        this.router.navigate(['/login']);
      },
      error: async (error) => {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message || 'Error al registrar usuario',
          backdrop: false
        });
      }
    });
  }

  ngOnInit() {
  }
}
