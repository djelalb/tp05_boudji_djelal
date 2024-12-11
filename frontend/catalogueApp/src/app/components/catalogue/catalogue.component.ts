import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CatalogueService, Product } from '../../services/catalogue.service';
import { SearchComponent } from '../search/search.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AddToCart } from '../../state/cart.state';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css'],
  standalone: true,
  imports: [CommonModule, SearchComponent]
})
export class CatalogueComponent implements OnInit {
  products$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;
  paginatedProducts: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  maxPageNumber: number = 1;
  isLoading: boolean = true;

  constructor(private catalogueService: CatalogueService, private store: Store) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.products$ = this.catalogueService.getCatalogue();
    this.filteredProducts$ = this.products$.pipe(
      map(products => {
        this.isLoading = false;
        this.maxPageNumber = Math.ceil(products.length / this.itemsPerPage);
        return products;
      })
    );
    this.filteredProducts$.subscribe(products => this.updatePagination(products));
  }

  filterProducts(filters: { term: string; category: string; minPrice: number | null; maxPrice: number | null }) {
    this.filteredProducts$ = this.products$.pipe(
      map(products =>
        products.filter(product => {
          const matchesName = product.name.toLowerCase().includes(filters.term.toLowerCase());
          const matchesCategory = product.category.toLowerCase().includes(filters.category.toLowerCase());
          const matchesMinPrice = filters.minPrice !== null ? product.price >= filters.minPrice : true;
          const matchesMaxPrice = filters.maxPrice !== null ? product.price <= filters.maxPrice : true;
          return matchesName && matchesCategory && matchesMinPrice && matchesMaxPrice;
        })
      ),
      startWith([])
    );
    this.filteredProducts$.subscribe(products => {
      this.maxPageNumber = Math.ceil(products.length / this.itemsPerPage);
      this.updatePagination(products);
    });
  }

  updatePagination(products: Product[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProducts = products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page < 1 || page > this.maxPageNumber) return;
    this.currentPage = page;
    this.filteredProducts$.subscribe(products => this.updatePagination(products));
  }

  addToCart(product: Product) {
    this.store.dispatch(new AddToCart(product)).subscribe({
      next: () => console.log('Produit ajouté au panier avec succès.'),
      error: (err) => console.error('Erreur : Impossible d’ajouter le produit au panier.', err)
    });  
  }
  
}
