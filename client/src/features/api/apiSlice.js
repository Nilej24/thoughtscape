import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  tagTypes: ['Card'],
  endpoints: (builder) => ({

    registerUser: builder.mutation({
      query: ({ name, email, password }) => ({
        url: '/users',
        method: 'POST',
        body: { name, email, password },
      }),
    }),

    signinUser: builder.mutation({
      query: ({ email, password }) => ({
        url: '/users/login',
        method: 'POST',
        body: { email, password },
      }),
    }),

    getUserDecks: builder.query({
      query: ({ token }) => ({
        url: '/decks',
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    getDeck: builder.query({
      query: ({ userToken, deckId }) => ({
        url: `/decks/${deckId}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }),
    }),

    getDeckCards: builder.query({
      query: ({ userToken, deckId }) => ({
        url: `/decks/${deckId}/cards`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }),
      providesTags: ['Card'],
    }),

    createEmptyCard: builder.mutation({
      query: ({ userToken, deckId }) => ({
        url: `/decks/${deckId}`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        body: {
          front: '',
          back: '',
        },
      }),
      invalidatesTags: ['Card'],
    }),

    updateCard: builder.mutation({
      query: ({ userToken, cardId, front, back, newDeckId }) => ({
        url: `/cards/${cardId}`,
        method: 'PUT',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        body: { front, back, newDeckId },
      }),
      invalidatesTags: ['Card'],
    }),

  }),
});

export const {
  useRegisterUserMutation,
  useSigninUserMutation,
  useGetUserDecksQuery,
  useGetDeckQuery,
  useGetDeckCardsQuery,
  useCreateEmptyCardMutation,
  useUpdateCardMutation,
} = apiSlice;
