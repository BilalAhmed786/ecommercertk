import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendurl } from '../baseurl/baseurl';


export const productApi = createApi({
reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${backendurl}/api`,credentials:'include'}),
  endpoints: (builder) => ({
    submitProductData: builder.mutation({
      query: (formData) => {
        
       return {
        
        url: '/products',
        method: 'POST',
        body: formData,
      
    }
      },
    }),
    getProductData: builder.query({
      query: ({ page=1, pageSize,saleprice,productcat,productFilter }) => {
        
       return {
        
        url: `products?page=${page}&pageSize=${pageSize}&saleprice=${saleprice}&productcat=${productcat}&productname=${productFilter}`,
        method: 'GET',
        
      
    }
      },
    }),
    getSingleProduct: builder.query({
      query: (id) => {
        
       return {
        
        url: `/product/${id}`,
       
        
      
    }
      },
    }),
    submitProductCategeroy: builder.mutation({
      query: (formCat) => {
        
       return {
        
        url: '/productcategory',
        method: 'POST',
        body: formCat
      
    }
      },
    }),
    getProductCategeroy: builder.query({
      query: (searchitem) => {
        
       return {
        
        url: `/productcategory?searchTerm=${searchitem}`,
        method: 'Get',
        
      
    }
      },
    }),
    getsingleProductCategeroy: builder.query({
      query: (id) => {
        
       return {
        
        url: `/productcategory/${id}`,
        method: 'Get',
        
      
    }
      },
    }),
    
    updateProductCategeroy: builder.mutation({
      query: (data) => {
        
       return {
        
        url: '/updateprocategory',
        method: 'post',
        body:data
        
      
    }
      },
    }),
    deleteProductCategeroy: builder.mutation({
      query: (id) => {
        console.log(id)
       return {
        
        url: `/deleteprocategory/${id}`,
        method: 'Delete',
      
        
      
    }
      },
    }),
    getCurrency: builder.query({
      query: () => {
         return {
        url: '/currency',
        method: 'Get',
        
      
    }
      },
    }),
    updateCurrency: builder.mutation({
      query: (data) => {
     
         return {
        url: '/updatecurrency',
        method: 'POST',
        body:data
        
      
    }
      },
    }),
 
    getShipment: builder.query({
      query: () => {
         return {
        url: '/shipment',
        method: 'Get',
        
        
      
    }
      },
    }),
    updateShipment: builder.mutation({
      query: (data) => {
        
         return {
        url: '/updateshipment',
        method: 'POST',
        body:data
       
      
        }
      },
    }),

    //admin products routes
    getAllProducts: builder.query({
      query: (searchpro) =>{
        console.log(searchpro)
        return{

          
        
      url :`allproducts?search=${searchpro}`,
      }
    }
      }),
      deleteSingleProduct: builder.mutation({
        query: (id) =>{
          console.log(id)
          return{
          
               url :`/removeprod/${id}`,
                method:'delete'
        }
      }
        }),
          deleteMultipleProduct: builder.mutation({
          query: (data) =>{
          
          return{
          
               url :'/removemultipleprod',
                method:'delete',
                body:data
        }
      }
        }),
        updateSingleProduct: builder.mutation({
          query: (data) =>{
            
            return{
            
                 url :'/updateprod',
                  method:'POST',
                  body:data
          }
        }
          }),

          StripePayment: builder.mutation({
            query: (data) =>{
            return{
                  url :'/paymentmode',
                    method:'POST',
                    body:data
                  }
          }
            }),
            productsReviews: builder.mutation({
              query: (data) =>{
                console.log(data)
              return{
                    url :'/productsreviews',
                      method:'POST',
                      body:data
                    }
            }
              }),
              getProductsreviews: builder.query({
                query: (id) =>{
                 
                return{
                      url :`/getproductreviews/${id}`,
                        method:'Get',
                        
                      }
              }
                }),
                getProductsslider: builder.query({
                  query: () =>{
                   
                  return{
                        url :'/getproductslide',
                          method:'Get',
                          
                        }
                }
                  }),
                  getReviewsforadmin:builder.query({
                    query: (searchpro) =>{
                     
                    return{
                          url :`/getadminreviews?searchTerm=${searchpro}`,
                            method:'Get',
                            
                          }
                  }
                    }),
                    getSingleReviewsforadmin:builder.query({
                      query: (id) =>{
                       
                      return{
                            url :`/getsingleadminreview/${id}`,
                              method:'Get',
                              
                            }
                    }
                      }),
                    deletesinglereview:builder.mutation({
                      query: (id) =>{
                       
                      return{
                            url :`/deletesinglereview/${id}`,
                              method:'Delete',
                              
                            }
                    }
                      }),
                      deletemultireviews:builder.mutation({
                        query: (data) =>{
                         
                        return{
                              url :`/deletemultiplereview`,
                                method:'post',
                                body:data
                                
                              }
                      }
                        }),
                        updatereviewstatus:builder.mutation({
                          query: (data) =>{
                           
                          return{
                                url :`/updatereviewstatus`,
                                  method:'post',
                                  body:data
                                  
                                }
                        }
                          }),
                        delegalleryimage:builder.mutation({

                           query:(data)=>{
                              console.log(data)
                            return{
                              url:'/deletegalleryimg',
                              method:'post',
                              body:data
                            }



                          }

                        })

  }),
});

export const { useSubmitProductDataMutation,
              useGetProductDataQuery,
              useSubmitProductCategeroyMutation,
              useGetSingleProductQuery,
              useGetProductCategeroyQuery,
              useUpdateProductCategeroyMutation,
              useDeleteProductCategeroyMutation,
              useGetsingleProductCategeroyQuery,
              useGetCurrencyQuery,
              useUpdateCurrencyMutation,
              useGetShipmentQuery,
              useUpdateShipmentMutation,
              useGetAllProductsQuery,
              useDeleteSingleProductMutation,
              useDeleteMultipleProductMutation,
              useUpdateSingleProductMutation,
              useStripePaymentMutation,
              useProductsReviewsMutation,
              useGetProductsreviewsQuery,
              useGetProductssliderQuery,
              useGetReviewsforadminQuery,
              useGetSingleReviewsforadminQuery,
              useDeletemultireviewsMutation,
              useDeletesinglereviewMutation,
              useUpdatereviewstatusMutation,
              useDelegalleryimageMutation
              
              

    } = productApi;

export default productApi;
