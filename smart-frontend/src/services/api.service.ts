import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuItem } from '../app/models/menu-items';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.apiBaseUrl}/api/menu-items`;

  constructor(private http: HttpClient) { }

  createMenuItem(text: string, imageType: 'ai' | 'photo', imageFile?: File): Observable<MenuItem> {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('imageType', imageType);
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.http.post<MenuItem>(this.baseUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getShareLink(id: string): Observable<{ shareLink: string }> {
    return this.http.get<{ shareLink: string }>(`${this.baseUrl}/${id}/share`).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}