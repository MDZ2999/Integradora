import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, chevronBackCircleOutline, chevronBackOutline, chevronForwardOutline, cloudUploadOutline } from 'ionicons/icons';

interface FormData {
  municipio: string;
  cantidad: number;
  codigoPostal: string;
  descripcion: string;
}

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.page.html',
  styleUrls: ['./edit-card.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditCardPage implements OnInit {
  productTitle: string = '';
  status: string = 'disponible';
  category: string = 'Papelería';
  quality: string = 'Nuevo';

  // Opciones para los selects
  statusOptions: string[] = ['Disponible', 'No disponible', 'Reservado'];
  categoryOptions: string[] = ['Papelería', 'Electrónica', 'Libros', 'Ropa', 'Otros'];
  qualityOptions: string[] = ['Nuevo', 'Como nuevo', 'Buen estado', 'Usado'];

  currentImage: string = "https://imgs.search.brave.com/8uPnX7CtNsRy6uZjn2Q9bheXAC3rM-xQTHHhqhUrxn4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/LmJvbnZpdmV1ci5j/b20vaGFtYnVyZ3Vl/c2EtY2xhc2ljYS5q/cGc";
  dominantColor: string = '#00C2BA';
  secondaryColor: string = '#F7B495';
  images: string[] = [this.currentImage];
  currentImageIndex: number = 0;

  formData: FormData = {
    municipio: '',
    cantidad: 0,
    codigoPostal: '',
    descripcion: ''
  };

  constructor() {
    addIcons({cloudUploadOutline,chevronBackOutline,chevronForwardOutline})
   }

  ngOnInit() {
    this.loadImageColors();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const newImage = e.target.result;
        this.images.push(newImage);
        this.currentImageIndex = this.images.length - 1;
        this.currentImage = newImage;
        this.loadImageColors();
      };
      reader.readAsDataURL(file);
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.images[this.currentImageIndex];
      this.loadImageColors();
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.images[this.currentImageIndex];
      this.loadImageColors();
    }
  }

  loadImageColors() {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = this.currentImage;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx?.drawImage(img, 0, 0);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
      
      if (imageData) {
        const colorMap = new Map();
        
        for (let i = 0; i < imageData.length; i += 4) {
          const rgba = `${imageData[i]},${imageData[i + 1]},${imageData[i + 2]}`;
          colorMap.set(rgba, (colorMap.get(rgba) || 0) + 1);
        }
        
        // Convertir el mapa a array y ordenar por frecuencia
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2);
        
        this.dominantColor = `rgb(${sortedColors[0][0]})`;
        if (sortedColors[1]) {
          this.secondaryColor = `rgb(${sortedColors[1][0]})`;
        }
      }
    };
  }

  async uploadImage() {
    // Aquí iría la lógica para subir una imagen
    console.log('Subir imagen');
  }

  onCategoryChange(event: any) {
    this.category = event.detail.value;
    // Reset subcategory when category changes
  }

  onSubmit() {
    // Aquí iría la lógica para guardar los cambios
    console.log('Formulario enviado:', {
      productTitle: this.productTitle,
      status: this.status,
      category: this.category,
      quality: this.quality,
      ...this.formData
    });
  }
}
