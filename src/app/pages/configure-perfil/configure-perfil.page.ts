import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, IonButton, IonIcon,
  IonItem, IonLabel, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

interface UserData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  foto?: {
    url: string;
    filename: string;
  };
}

@Component({
  selector: 'app-configure-perfil',
  templateUrl: './configure-perfil.page.html',
  styleUrls: ['./configure-perfil.page.scss'],
  standalone: true,
  imports: [
    IonIcon, 
    IonButton, 
    IonAvatar, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonSpinner,
    CommonModule, 
    FormsModule
  ]
})
export class ConfigurePerfilPage implements OnInit {
  userData: UserData = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: ''
  };
  
  profileImage: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const userId = localStorage.getItem('usuarioId');
    if (!userId) {
      Swal.fire('Error', 'No se encontró el ID del usuario', 'error');
      return;
    }

    this.http.get<UserData>(`${environment.backendUrl}/api/usuarios/${userId}`).subscribe({
      next: (data) => {
        this.userData = data;
        if (data.foto?.url) {
          this.profileImage = data.foto.url;
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
        Swal.fire('Error', 'No se pudieron cargar los datos del usuario', 'error');
      }
    });
  }

  async selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('foto', file);

        const userId = localStorage.getItem('usuarioId');
        this.isLoading = true;

        try {
          const response: any = await this.http.post(
            `${environment.backendUrl}/api/usuarios/${userId}/foto`,
            formData
          ).toPromise();

          this.profileImage = response.foto.url;
          Swal.fire('Éxito', 'Foto de perfil actualizada', 'success');
        } catch (error) {
          console.error('Error al subir la imagen:', error);
          Swal.fire('Error', 'No se pudo actualizar la foto de perfil', 'error');
        } finally {
          this.isLoading = false;
        }
      }
    };
    input.click();
  }

  async updateProfile() {
    this.isLoading = true;
    const userId = localStorage.getItem('usuarioId');

    try {
      await this.http.put(
        `${environment.backendUrl}/api/usuarios/${userId}`,
        this.userData
      ).toPromise();

      Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
