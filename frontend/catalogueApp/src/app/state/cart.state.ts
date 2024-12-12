import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Product } from '../services/catalogue.service';

export class AddToCart {
  static readonly type = '[Cart] Add';
  constructor(public product: Product) {}
}

export class RemoveFromCart {
  static readonly type = '[Cart] Remove';
  constructor(public productId: number) {}
}

export interface CartStateModel {
  items: Product[];
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    items: []
  }
})
@Injectable()
export class CartState {
  @Selector()
  static getCartItems(state: CartStateModel): Product[] {
    return state.items || []; // Renvoie une liste vide par défaut
  }
  
  @Selector()
  static getCartCount(state: CartStateModel): number {
    return state.items?.length || 0; // Renvoie 0 si state.items est indéfini
  }
  

  @Action(AddToCart)
  addToCart(ctx: StateContext<CartStateModel>, action: AddToCart) {
    const state = ctx.getState();
    const existingProduct = state.items.find(item => item.id === action.product.id);
    if (!existingProduct) {
      ctx.setState({
        ...state,
        items: [...state.items, action.product]
      });
    }
  }

  @Action(RemoveFromCart)
  removeFromCart(ctx: StateContext<CartStateModel>, action: RemoveFromCart) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      items: state.items.filter(item => item.id !== action.productId)
    });
  }
}
