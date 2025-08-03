import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  products:[],
  cart: JSON.parse(localStorage.getItem('cartItems')) || [],
    
  };
  
  const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      addToCart(state, action) {
        const productId = action.payload;
        const product = state.products.find((p) => p._id === productId);
        if (product) {
          const existingItem = state.cart.find((item) => item._id === productId);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          state.cart.push({ ...product, quantity:1});
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cart));
        }
      },
      removeFromCart(state, action) {
        const productId = action.payload;
        state.cart = state.cart.filter((product) => product._id !== productId);
        localStorage.setItem('cartItems', JSON.stringify(state.cart));
      },
      decreaseQuantity(state, action) {
        const productId = action.payload;
        const existingItem = state.cart.find((item) => item._id === productId);
        if (existingItem && existingItem.quantity > 1) {
          existingItem.quantity--;
          localStorage.setItem('cartItems', JSON.stringify(state.cart));
        }
      },
      increaseQuantity(state, action) {
        const productId = action.payload;
        const existingItem = state.cart.find((item) => item._id === productId);
        if (existingItem) {
          existingItem.quantity++;
          localStorage.setItem('cartItems', JSON.stringify(state.cart));
        }
      },
      addProducts(state, action) {  //add products from shop page to cartslice
        state.products = action.payload;
      
      }
    },
  });

  export const { addToCart, removeFromCart,decreaseQuantity,
    increaseQuantity,addProducts } = cartSlice.actions;

  const rootReducer = cartSlice.reducer;

  export default rootReducer