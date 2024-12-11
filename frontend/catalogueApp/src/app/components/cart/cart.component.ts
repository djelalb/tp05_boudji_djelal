import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { CartState, RemoveFromCart } from '../../state/cart.state';
import { Observable, of } from 'rxjs';
import { Product } from '../../services/catalogue.service';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  @Select(CartState.getCartItems) cartItems$: Observable<Product[]> = of([]);
  @Select(CartState.getCartCount) cartCount$: Observable<number>= of(0);

  total$: Observable<number>;

  constructor(private store: Store) {
    this.total$ = this.cartItems$.pipe(
      map((items) =>
        items.reduce((total, item) => total + item.price, 0)
      )
    );
  }

  removeFromCart(productId: number) {
    this.store.dispatch(new RemoveFromCart(productId)).subscribe({
      next: () => console.log('Produit retiré du panier'),
      error: (err) => console.error('Erreur lors de la suppression :', err)
    });
  }  
}
