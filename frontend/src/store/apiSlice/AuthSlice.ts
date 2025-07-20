import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/auth`,
    credentials: "include",
  }),
  tagTypes: ["clients"],

  endpoints: (builder) => ({
    checkUserRole: builder.mutation({
      query: (email) => ({
        url: `/check-user-role/${email}`,
        method: "GET",
      }),
    }),
    verifyEmail: builder.query({
      query: (token) => `/verify-email?token=${token}`,
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),
    signIn: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            authSlice.util.updateQueryData(
              "getClientInfo",
              undefined,
              () => data
            )
          );
        } catch (err) {
          console.error("signIn error:", err);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(authSlice.util.resetApiState());

          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (err) {
          console.error("Logout error:", err);
        }
      },
    }),

    getUserInfo: builder.query({
      query: () => ({
        url: "/user-info",
      }),
      transformResponse: (response: any) => response,
    }),
    getSingleUser: builder.query({
      query: () => ({
        url: `/get-user`,
      }),
      transformResponse: (response: any) => response,
    }),
    checkUserSoldService: builder.mutation({
      query: (email) => ({
        url: "/check-user",
        method: "POST",
        body: { email },
      }),
      transformResponse: (response: any) => response,
    }),
    getAllClients: builder.query({
      query: () => "/get-all-user",
      providesTags: ["clients"],
    }),
    getClientInfo: builder.query({
      query: () => ({ url: "/user-info", credentials: "include" }),
    }),
    updateClient: builder.mutation({
      query: ({ data, email }) => ({
        url: `/update-client/${email}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["clients"],
    }),
    deleteClient: builder.mutation({
      query: (email) => ({
        url: `/delete-client/${email}`,
        method: "DELETE",
      }),
      invalidatesTags: ["clients"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetUserInfoQuery,
  useCheckUserSoldServiceMutation,
  useGetSingleUserQuery,
  useLogoutMutation,
  useGetAllClientsQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientInfoQuery,
  useCheckUserRoleMutation,
  useVerifyEmailQuery,
} = authSlice;
