import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

interface ProductDetails {
  title: string;
  status: string;
  category: string;
  quality: string;
  municipio: string;
  cantidad: number;
  codigoPostal: string;
  descripcion: string;
  images: string[];
}

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.page.html',
  styleUrls: ['./detail-card.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetailCardPage implements OnInit {
  productDetails: ProductDetails = {
    title: 'Producto de ejemplo',
    status: 'Disponible',
    category: 'Papelería',
    quality: 'Nuevo',
    municipio: 'Ciudad Ejemplo',
    cantidad: 10,
    codigoPostal: '12345',
    descripcion: 'Descripción detallada del producto',
    images: ['https://imgs.search.brave.com/3OmfyiahPtmXT2PQE_d1yIwmgmUHPeE2QRmzmPz6nsM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cGF1bGluYWNvY2lu/YS5uZXQvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjQvMTIvdmVy/ZHVyYXMtcGFyYS1j/b2NpbmFyLTE3MzQ0/MjY1ODkuanBn']
  };

  currentImage: string = "";
  dominantColor: string = '#00C2BA';
  secondaryColor: string = '#F7B495';
  images: string[] = [];
  currentImageIndex: number = 0;

  constructor() {
    addIcons({ star });
   }

  ngOnInit() {
    // Initialize with the first image from productDetails
    if (this.productDetails.images && this.productDetails.images.length > 0) {
      this.images = [...this.productDetails.images];
      this.currentImage = this.images[0];
      this.loadImageColors();
    }
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

}
