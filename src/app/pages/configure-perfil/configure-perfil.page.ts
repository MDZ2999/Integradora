import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
         IonBackButton, IonAvatar, IonButton, IonIcon, IonItem, 
         IonLabel, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, arrowBackOutline } from 'ionicons/icons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
    private router: Router,
    private navCtrl: NavController,
    private http: HttpClient
  ) {
    addIcons({ camera, arrowBackOutline });
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const userId = await this.authService.getUsuarioIdPromise();
      if (!userId) throw new Error('No se encontró ID de usuario');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró token');

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      // Obtener los datos completos del usuario
      this.http.get<any>(`${environment.backendUrl}/api/auth/usuarios/${userId}`, { headers })
        .subscribe({
          next: (data) => {
            console.log('Datos del usuario recibidos:', data);
            
            this.userData = {
              nombre: data.nombre || '',
              apellidoPaterno: data.apellidoPaterno || '',
              apellidoMaterno: data.apellidoMaterno || '',
              correo: data.correo || '',
              contrasena: '' // No mostramos la contraseña actual
            };

            console.log('userData actualizado:', this.userData);

            // Cargar imagen si existe
            if (data.foto?.url) {
              this.profileImage = data.foto.url;
            } else {
              this.profileImage = '../../../assets/img/Perfil.jpeg';
            }
          },
          error: (error) => {
            console.error('Error al cargar datos del usuario:', error);
          }
        });
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = this.onload.bind(this);
      reader.readAsDataURL(file);
    }
  }

  onload(e: any) {
    if (e.target?.result) {
      this.profileImage = e.target.result;
    }
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      const userId = await this.authService.getUsuarioIdPromise();
      if (!userId) throw new Error('No se encontró ID de usuario');

      const formData = new FormData();
      formData.append('nombre', this.userData.nombre);
      formData.append('apellidoPaterno', this.userData.apellidoPaterno);
      formData.append('apellidoMaterno', this.userData.apellidoMaterno);
      
      if (this.userData.correo) formData.append('correo', this.userData.correo);
      if (this.userData.contrasena) formData.append('contrasena', this.userData.contrasena);
      
      // Manejo específico para la imagen
      if (this.selectedFile) {
        // Convertir la imagen a base64
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        
        reader.onload = async () => {
          try {
            const base64Image = reader.result as string;
            formData.append('foto', JSON.stringify({
              url: base64Image,
              filename: this.selectedFile!.name
            }));

            console.log('FormData a enviar:');
            formData.forEach((value, key) => {
              if (key === 'foto') {
                console.log(key, ':', 'Datos de imagen presentes');
              } else {
                console.log(key, ':', value);
              }
            });

            // Usar el nuevo método updateProfile
            await this.authService.updateProfile(userId, formData).toPromise();

            // Si se cambió el correo o la contraseña, cerrar sesión
            if (this.userData.correo || this.userData.contrasena) {
              this.authService.logout();
              this.router.navigate(['/login']);
            } else {
              this.goBack();
            }
          } catch (error) {
            console.error('Error al procesar la imagen:', error);
            this.isLoading = false;
          }
        };

        reader.onerror = (error) => {
          console.error('Error al leer la imagen:', error);
          this.isLoading = false;
        };
      } else {
        // Si no hay imagen nueva, enviar el resto de los datos
        console.log('FormData a enviar (sin imagen):');
        formData.forEach((value, key) => {
          console.log(key, ':', value);
        });

        // Usar el nuevo método updateProfile
        await this.authService.updateProfile(userId, formData).toPromise();

        // Si se cambió el correo o la contraseña, cerrar sesión
        if (this.userData.correo || this.userData.contrasena) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.goBack();
        }
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      if (!this.selectedFile) {
        this.isLoading = false;
      }
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
