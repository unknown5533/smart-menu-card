import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // <-- Add this
import { LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.services';
import { Browser } from '@capacitor/browser';
import { Router } from '@angular/router';
import { MenuItem } from '../models/menu-items';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, FormsModule, CommonModule] // <-- Add FormsModule here
})
export class HomePage {
  itemForm: any; // Using any for FormGroup for simplicity, can be typed more strictly
  createdItem: MenuItem | null = null;
  imageType: 'ai' | 'photo' = 'ai';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  async createItem() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating your menu item with AI...'
    });
    await loading.present();

    try {
      this.createdItem = await this.apiService.createMenuItem(
        this.itemForm.value.text,
        this.imageType,
        this.selectedFile || undefined
      ).toPromise() || null;
      
      await loading.dismiss();
      this.presentToast('Menu item created successfully!', 'success');

    } catch (error) {
      await loading.dismiss();
      this.presentToast('Failed to create item. Please try again.', 'danger');
      console.error(error);
    }
  }

  async shareItem() {
    if (!this.createdItem) return;
    
    try {
      const response = await this.apiService.getShareLink(this.createdItem._id).toPromise();
      if (response) {
        await Browser.open({ url: response.shareLink });
      }
    } catch (error) {
      this.presentToast('Could not generate share link.', 'danger');
      console.error(error);
    }
  }

  resetForm() {
    this.itemForm.reset();
    this.createdItem = null;
    this.selectedFile = null;
    this.imageType = 'ai';
  }

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
