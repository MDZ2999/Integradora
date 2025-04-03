import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
         IonBackButton, IonAvatar, IonButton, IonIcon, IonItem, 
         IonLabel, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { camera, arrowBackOutline } from 'ionicons/icons';

interface UserData {
  _id?: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contrasena?: string;
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
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonAvatar,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonSpinner
  ]
})
export class ConfigurePerfilPage implements OnInit {
  isLoading = false;
  isLeaving = false;
  userData: UserData = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
  };
  
  profileImage: string = '';
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private navCtrl: NavController
  ) {
    addIcons({ camera, arrowBackOutline });
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const userId = await this.authService.getUsuarioIdPromise();
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        throw new Error('No se encontró ID de usuario o token');
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      this.http.get<UserData>(`${environment.backendUrl}/api/auth/usuarios/${userId}`, { headers }).subscribe(
        (data) => {
          this.userData = {
            nombre: data.nombre,
            apellidoPaterno: data.apellidoPaterno,
            apellidoMaterno: data.apellidoMaterno,
            correo: data.correo,
            contrasena: '' // No mostramos la contraseña actual
          };
          if (data.foto?.url) {
            this.profileImage = data.foto.url;
          }
        },
        (error) => {
          console.error('Error al cargar datos del usuario:', error);
        }
      );
    } catch (error) {
      console.error('Error al obtener ID del usuario:', error);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      const userId = await this.authService.getUsuarioIdPromise();
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        throw new Error('No se encontró ID de usuario o token');
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const formData = new FormData();
      
      // Solo incluimos los campos que tienen valor
      if (this.userData.nombre) formData.append('nombre', this.userData.nombre);
      if (this.userData.apellidoPaterno) formData.append('apellidoPaterno', this.userData.apellidoPaterno);
      if (this.userData.apellidoMaterno) formData.append('apellidoMaterno', this.userData.apellidoMaterno);
      if (this.userData.correo) formData.append('correo', this.userData.correo);
      if (this.userData.contrasena) formData.append('contrasena', this.userData.contrasena);
      if (this.selectedFile) formData.append('foto', this.selectedFile);

      await this.http.put(
        `${environment.backendUrl}/api/auth/usuarios/${userId}`, 
        formData,
        { headers }
      ).toPromise();
      
      this.goBack();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.isLeaving = true;
    setTimeout(() => {
      this.navCtrl.back();
    }, 500);
  }

  cancelar() {
    this.goBack();
  }
}
