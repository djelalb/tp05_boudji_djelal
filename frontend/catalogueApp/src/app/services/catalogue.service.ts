import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  private apiUrl = 'assets/products.json';

  constructor(private http: HttpClient) { }

  getCatalogue(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement du catalogue', error);
        return of([]); // retourne un tableau vide en cas d'erreur
      })
    );
  }
}
