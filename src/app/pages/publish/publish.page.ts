import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, arrowBackOutline } from 'ionicons/icons';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.page.html',
  styleUrls: ['./publish.page.scss'],
  standalone: true,
  imports: [IonIcon, IonInput, IonLabel, IonItem, IonButton, IonContent, CommonModule, FormsModule, IonSelect,
  IonSelectOption],
})
export class PublishPage implements OnInit {
  producto = {
    Nom_producto: '',
    Cantidad: null,
    Municipio: '',
    Codigo_postal: null,
    Numero_telefonico: null,
    Calidad: '',
    Categoria: '',
    Descripcion: '',
    Estado: 'Disponible',
    Imagen: {
      nombre: '',
      contenido: ''
    }
  };
  
  isLeaving = false;
  formSubmitted = false;

  constructor(
    private navCtrl: NavController, 
    private router: Router,
    private productosService: ProductosService,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    addIcons({arrowBackOutline,cloudUploadOutline});
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      this.presentAlert('Error', 'Por favor inicia sesión para publicar un producto');
    }
  }

  openFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.producto.Imagen.nombre = file.name;
      // Convertir la imagen a base64
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.producto.Imagen.contenido = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  validateForm(): boolean {
    return !!(
      this.producto.Nom_producto &&
      this.producto.Cantidad &&
      this.producto.Municipio &&
      this.producto.Codigo_postal &&
      this.producto.Numero_telefonico &&
      this.producto.Calidad &&
      this.producto.Categoria &&
      this.producto.Descripcion &&
      this.producto.Estado &&
      this.producto.Imagen.contenido
    );
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async goToHome() {
    this.formSubmitted = true;
    
    if (!this.validateForm()) {
      await this.presentAlert('Error', 'Por favor, complete todos los campos obligatorios');
      return;
    }

    try {
      await this.productosService.crearProducto(this.producto).toPromise();
      await this.presentAlert('Éxito', 'Producto publicado correctamente');
      this.router.navigate(['/home']);
    } catch (error: any) {
      if (error.message.includes('no autenticado')) {
        this.router.navigate(['/login']);
      }
      await this.presentAlert('Error', error.message);
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
