import { Component } from '@angular/core';
import { ApiService } from '../../services/api.services';
import { MenuItem } from '../../models/menu-items';
import { CartService } from '../../services/cart.services';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MenuPage {
  menuItems: MenuItem[] = [];

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    this.loadMenuItems();
  }

  loadMenuItems() {
    this.apiService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
      },
      error: (err) => {
        console.error('Failed to load menu items', err);
      }
    });
  }

  async addToCart(item: MenuItem) {
    this.cartService.addToCart(item);
    const toast = await this.toastCtrl.create({
      message: `${item.title} added to cart!`,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }
}