import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendurl } from '../baseurl/baseurl';

   const OrderApi = createApi({
    reducerPath: 'Ordersapi',
    baseQuery: fetchBaseQuery({ baseUrl: `${backendurl}/api`,credentials:'include'}),
    endpoints: (builder) => ({
        allOrdersforadmin: builder.query({
            query: (search) => {
                return {
                    url: `orders?searchTerm=${search}`,

                }
            },
        }),
        allOrdersforclient: builder.query({
          query: ({search,email}) => {
            
              return {
                  url: `clientorders?searchTerm=${search}&email=${email}`,

              }
          },
      }),
        getSingleorderforadmin: builder.query({
            query: (id) => {
             
                return {
                    url: `/order/${id}`,

                }
            },
        }),
        getSingleorderforclient: builder.query({
          query: (id) => {
              return {
                  url: `/clientorders/${id}`,

              }
          },
      }),

        deleteSingleOrder: builder.mutation({
            query: (id) =>{
             
              return{
              
                   url :`/removeorder/${id}`,
                    method:'delete'
            }
          },
            }),
            deleteSingleOrderclient: builder.mutation({
              query: (id) =>{
               
                return{
                
                     url :`/removeclientorder/${id}`,
                      method:'delete'
              }
            },
              }),
              deleteMultipleOrderadmin: builder.mutation({
                query: (data) =>{
                 
                  return{
                  
                       url :'/removemultipleadminorder',
                        method:'Post',
                        body:data

                }
              },
                }),
                deleteMultipleOrderclient: builder.mutation({
                  query: (data) =>{
                   
                    return{
                    
                         url :'/removemultipleclientorder',
                          method:'Post',
                          body:data
  
                  }
                },
                  }),
              
            singleOrderStatus: builder.mutation({
                query: (data) =>{
                 
                  return{
                  
                       url :'/orderstatus',
                        method:'post',
                        body:data
                }
              },
                }),
                getBillingaddress: builder.query({
                    query: (email) =>{
                     console.log(email)
                      return{
                      
                           url :`/billingaddress/${email}`,
                            method:'GET',
                            
                    }
                  },
                    }),
                    updateBillingaddress: builder.mutation({
                        query: (data) =>{
                        
                          return{
                          
                               url :'/updatebillingaddress',
                                method:'POST',
                                body:data
                                
                        }
                      },
                        }),

    })
})

export const {
    useAllOrdersforadminQuery,
    useAllOrdersforclientQuery,
    useGetSingleorderforadminQuery,
    useGetSingleorderforclientQuery,
    useDeleteSingleOrderMutation,
    useDeleteSingleOrderclientMutation,
    useDeleteMultipleOrderadminMutation,
    useDeleteMultipleOrderclientMutation,
    useSingleOrderStatusMutation,
    useGetBillingaddressQuery,
    useUpdateBillingaddressMutation
   

} = OrderApi;

export default OrderApi;