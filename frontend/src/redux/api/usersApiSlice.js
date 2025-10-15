// src/redux/api/usersApiSlice.js
import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // USER AUTH
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    // PROFILE UPDATE
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update`, // your backend route
        method: "POST",
        body: data,
      }),
    }),

    // ADMIN: GET ALL USERS
    getUsers: builder.query({
      query: () => USERS_URL,
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    // ADMIN: DELETE USER
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // ADMIN: UPDATE USER
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ADMIN: GET SINGLE USER DETAILS
    getUserDetails: builder.query({
      query: (id) => `${USERS_URL}/${id}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation, // for Profile.jsx
  useGetUsersQuery,         // for UserList.jsx
  useDeleteUserMutation,    // for UserList.jsx
  useUpdateUserMutation,    // for UserList.jsx
  useGetUserDetailsQuery,   // optional for admin edit forms
} = userApiSlice;
