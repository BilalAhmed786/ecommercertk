import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/cartslice';
import authApi from './app/apiauth';
import productApi from './app/apiproducts';
import userApi from './app/apiusers';
import OrderApi from './app/apiorders';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [OrderApi.reducerPath]: OrderApi.reducer,

    cart: rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware,
      authApi.middleware,userApi.middleware,OrderApi.middleware),
});



export default store;