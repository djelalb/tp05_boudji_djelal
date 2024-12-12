import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { CartState, RemoveFromCart } from '../../state/cart.state';
import { Observable } from 'rxjs';
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
export class CartComponent implements OnInit {
  @Select(CartState.getCartItems) cartItems$!: Observable<Product[]>;
  @Select(CartState.getCartCount) cartCount$!: Observable<number>;

  total$!: Observable<number>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.cartItems$ = this.store.select(CartState.getCartItems);
    this.total$ = this.cartItems$.pipe(
      map((items) => (items || []).reduce((total, item) => total + item.price, 0))
    );
  }

  removeFromCart(productId: number) {
    this.store.dispatch(new RemoveFromCart(productId));
  }
}
