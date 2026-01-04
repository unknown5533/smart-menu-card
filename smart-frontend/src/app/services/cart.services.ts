import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../models/menu-items';

export interface CartItem extends MenuItem {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.cartItems);

  cart$ = this.cartSubject.asObservable();

  constructor() { }

  addToCart(item: MenuItem): void {
    const existingItem = this.cartItems.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ ...item, quantity: 1 });
    }
    this.updateCart();
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item._id !== itemId);
    this.updateCart();
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems.find(cartItem => cartItem._id === itemId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  get getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
  }
}