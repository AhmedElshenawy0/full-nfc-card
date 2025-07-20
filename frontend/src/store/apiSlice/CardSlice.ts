import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cardSlice = createApi({
  reducerPath: "card",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/cards`,
    credentials: "include",
  }),
  tagTypes: ["cards"],

  endpoints: (builder) => ({
    getAllCards: builder.query({
      query: () => "/",
      providesTags: ["cards"],
    }),
    verifyCard: builder.query({
      query: (query) => `/verifyCard?unique_code=${query}`,
    }),
    createCard: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cards"],
    }),
    deleteCard: builder.mutation({
      query: (unique_code) => ({
        url: `/${unique_code}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cards"],
    }),
  }),
});

export const {
  useVerifyCardQuery,
  useCreateCardMutation,
  useGetAllCardsQuery,
  useDeleteCardMutation,
} = cardSlice;
