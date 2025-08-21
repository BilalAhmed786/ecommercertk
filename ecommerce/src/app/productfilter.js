import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendurl } from '../baseurl/baseurl';
export const productfilterApi = createApi({
    reducerPath: 'productfilter',
    baseQuery: fetchBaseQuery({ baseUrl: `${backendurl}/api`,credentials:'include'}),
    endpoints: (builder) => ({
        getRange: builder.query({
            query: () => {
                return {
                    url: `/getranges`,
                    
                }
            },
        }),
           addRange: builder.mutation({
            query: (data) => {
               
                return {
                    url: '/addranges',
                    method: 'POST', 
                    body:data
                }
            },
        }),
            updateRange: builder.mutation({
            query: (data) => {
                return {
                    url: '/editranges',
                    method:'POST',
                    body:data
                }
            },
        }),
            deleteRange: builder.mutation({
            query: (id) => {

                return {
                    url: `/deleteranges/${id}`,
                    method:'DELETE'
                
                }
            },
        }),
    })
})

export const {
  useGetRangeQuery,
  useAddRangeMutation,
  useUpdateRangeMutation,
  useDeleteRangeMutation,



} = productfilterApi;


export default productfilterApi; 