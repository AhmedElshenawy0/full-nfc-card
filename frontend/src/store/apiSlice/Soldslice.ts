import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const soldServiceSlice = createApi({
  reducerPath: "soldService",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/soldServices`,
    credentials: "include",
  }),
  tagTypes: ["SoldService"],

  endpoints: (builder) => ({
    getAllSoldServices: builder.query({
      query: () => `/`,
      providesTags: ["SoldService"],
    }),
    getOneSoldServices: builder.query({
      query: (id) => ({
        url: `/get-one/${id}`,
        credentials: "include",
      }),
      providesTags: (id) => [{ type: "SoldService", id }],
    }),
    createSoldService: builder.mutation({
      query: (data) => ({
        url: `/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      // async onQueryStarted(_, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled;
      //     dispatch(soldServiceSlice.util.invalidateTags(["SoldService"]));
      //   } catch (err) {
      //     console.error("Create failed:", err);
      //   }
      // },
      invalidatesTags: ["SoldService"],
    }),

    updateSoldService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedSoldService } = await queryFulfilled;

          //  Update SoldService
          dispatch(
            soldServiceSlice.util.updateQueryData(
              "getOneSoldServices",
              id,
              (draft) => {
                Object.assign(draft, updatedSoldService);
              }
            )
          );

          //  Also update the list (if needed)
          dispatch(
            soldServiceSlice.util.updateQueryData(
              "getAllSoldServices",
              undefined,
              (draft) => {
                const index = draft.findIndex((item: any) => item.id === id);
                if (index !== -1) {
                  draft[index] = updatedSoldService;
                }
              }
            )
          );
        } catch (error) {
          console.error("Update failed:", error);
        }
      },
      invalidatesTags: ({ id }) => [{ type: "SoldService", id }],
    }),
    updateMenuService: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/menu/${id}`,
          method: "PUT",
          body: data,
          headers: {},
        };
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedSoldService } = await queryFulfilled;

          dispatch(
            soldServiceSlice.util.updateQueryData(
              "getOneSoldServices",
              id,
              (draft) => {
                Object.assign(draft, updatedSoldService);
              }
            )
          );

          dispatch(
            soldServiceSlice.util.updateQueryData(
              "getAllSoldServices",
              undefined,
              (draft) => {
                const index = draft.findIndex((item: any) => item.id === id);
                if (index !== -1) {
                  draft[index] = updatedSoldService;
                }
              }
            )
          );
        } catch (err) {
          console.error("Update failed:", err);
        }
      },
      invalidatesTags: ({ id }) => [{ type: "SoldService", id }],
    }),

    deleteSoldService: builder.query({
      query: (type) => ({
        url: `/${type}`,
      }),
    }),
  }),
});

export const {
  useGetOneSoldServicesQuery,
  useGetAllSoldServicesQuery,
  useCreateSoldServiceMutation,
  useUpdateSoldServiceMutation,
  useDeleteSoldServiceQuery,
  useUpdateMenuServiceMutation,
} = soldServiceSlice;
