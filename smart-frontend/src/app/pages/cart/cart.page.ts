import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem, CartService } from '../../services/cart.services';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] // FormsModule for ion-input
})
export class CartPage {
  cartItems$: Observable<CartItem[]>;

  constructor(
    private cartService: CartService,
    private toastCtrl: ToastController
  ) {
    this.cartItems$ = this.cartService.cart$;
  }

  get total(): number {
    return this.cartService.getTotal;
  }

  updateQuantity(item: CartItem, event: any) {
    const quantity = event.detail.value;
    if (quantity > 0) {
      this.cartService.updateQuantity(item._id, quantity);
    }
  }

  async removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item._id);
    const toast = await this.toastCtrl.create({
      message: `${item.title} removed.`,
      duration: 2000,
      color: 'medium'
    });
    await toast.present();
  }

  async checkout() {
    const toast = await this.toastCtrl.create({
      message: 'Checkout functionality would be implemented here!',
      duration: 3000,
      color: 'success'
    });
    await toast.present();
    this.cartService.clearCart();
  }
}