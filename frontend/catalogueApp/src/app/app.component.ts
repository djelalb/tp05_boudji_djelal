import { Component, Renderer2  } from '@angular/core';
import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { SearchComponent } from './components/search/search.component';
import { Store, Select } from '@ngxs/store';
import { CartState } from './state/cart.state';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Product } from './services/catalogue.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CatalogueComponent, SearchComponent, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  @Select(CartState.getCartItems) cartItems$!: Observable<Product[]>;
  @Select(CartState.getCartCount) cartCount$!: Observable<number>;

  showCartPreview: boolean = false;

  toggleCartPreview() {
    this.showCartPreview = !this.showCartPreview;
  }

  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events.subscribe(() => {
      if (this.router.url === '/cart') {
        this.renderer.addClass(document.body, 'cart-active');
      } else {
        this.renderer.removeClass(document.body, 'cart-active');
      }
    });
  }
  isCartRoute(): boolean {
    return this.router.url === '/cart';
  }
}
