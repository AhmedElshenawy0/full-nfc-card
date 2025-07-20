import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const serviceSlice = createApi({
  reducerPath: "service",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/services`,
  }),
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => `/`,
    }),
    getOneServices: builder.query({
      query: (type) => ({
        url: `/${type}`,
      }),
    }),
    updateService: builder.mutation({
      query: ({ type, data }) => ({
        url: `/${type}`,
        method: "PUT",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    deleteService: builder.query({
      query: (type) => ({
        url: `/${type}`,
      }),
    }),
  }),
});

export const {
  useGetOneServicesQuery,
  useGetAllServicesQuery,
  useUpdateServiceMutation,
  useDeleteServiceQuery,
} = serviceSlice;
