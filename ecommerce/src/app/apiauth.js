import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendurl } from '../baseurl/baseurl';

 const authApi = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({ baseUrl: `${backendurl}/api`, credentials: 'include'}),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (Data) => {
                return {
                    url: 'register',
                    method: 'POST',
                    body: Data,
                }
            },
        }),
        loginUser: builder.mutation({
            query: (Data) => {
                return {
                    url: 'login',
                    method: 'POST',
                    body: Data,
                }
            },
        }),
           logoutUser: builder.mutation({
            query: () => {
                return {
                    url: 'logout',
                    method: 'POST',
                   
                }
            },
        }),
        forgetpassword: builder.mutation({
            query: (data) => {
                return {
                    url: 'forgetpass',
                    method: 'POST',
                    body:data
                   
                }
            },
        }),
        resetpassword: builder.mutation({
            query: (data) => {
                return {
                    url: 'resetpassword',
                    method: 'POST',
                    body:data
                   
                }
            },
        }),
        userDetails: builder.mutation({
            query: () => ({
            
                    url: 'auth',
                    method: 'POST',
                    
                    
}),
        }),
        adminchangePassword: builder.mutation({
            query: (data) => ({
            
                    url: 'changepass',
                    method: 'POST',
                    body:data
                    
}),
        }),
        clientchangePassword: builder.mutation({
            query: (data) => ({
            
                    url: 'clientchangepass',
                    method: 'POST',
                    body:data
                    
}),
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useUserDetailsMutation,
    useLogoutUserMutation,
    useAdminchangePasswordMutation,
    useClientchangePasswordMutation,
    useForgetpasswordMutation,
    useResetpasswordMutation

} = authApi;

export default authApi;
