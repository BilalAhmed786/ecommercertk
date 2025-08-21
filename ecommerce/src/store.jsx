import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/cartslice';
import authApi from './app/apiauth';
import productApi from './app/apiproducts';
import userApi from './app/apiusers';
import OrderApi from './app/apiorders';
import productfilterApi from './app/productfilter';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [OrderApi.reducerPath]: OrderApi.reducer,
    [productfilterApi.reducerPath]: productfilterApi.reducer,

    cart: rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware,
      authApi.middleware,userApi.middleware,OrderApi.middleware,productfilterApi.middleware),
});



export default store;