import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonCard, IonCardContent, IonCardHeader } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/productos.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donaciones',
  templateUrl: './donaciones.page.html',
  styleUrls: ['./donaciones.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule, IonCard, IonCardContent, IonCardHeader]
})
export class DonacionesPage implements OnInit {
  isLeaving = false;
  userProducts: Producto[] = [];
  userId: string | null = null;

  constructor(
    private navCtrl: NavController,
    private productosService: ProductosService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({arrowBackOutline});
  }

  ngOnInit() {
    console.log('DonacionesPage - ngOnInit');
    this.loadUserProducts();
  }

  loadUserProducts() {
    const userId = this.authService.getUsuarioId();
    console.log('DonacionesPage - Usuario ID:', userId);
    
    if (userId) {
      this.userId = userId;
      this.productosService.getProductosConUsuarios().subscribe({
        next: (productos) => {
          console.log('DonacionesPage - Todos los productos:', productos);
          this.userProducts = productos.filter(producto => {
            const match = String(producto.id_usuarios._id) === userId;
            console.log('Comparando:', {
              productoUserId: producto.id_usuarios._id,
              currentUserId: userId,
              match: match
            });
            return match;
          });
          console.log('DonacionesPage - Productos filtrados del usuario:', this.userProducts);
        },
        error: (error) => {
          console.error('DonacionesPage - Error al cargar los productos:', error);
        }
      });
    } else {
      console.error('DonacionesPage - No se encontró ID de usuario');
    }
  }

  goBack() {
    this.isLeaving = true;
    setTimeout(() => {
      this.navCtrl.back();
    }, 500);
  }

  onCardClick(producto: Producto) {
    localStorage.setItem('selectedProduct', JSON.stringify(producto));
    this.router.navigate(['/detail-card']);
  }
}
