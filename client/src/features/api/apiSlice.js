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
      providesTags: ['Deck'],
    }),

    getDeck: builder.query({
      query: ({ userToken, deckId }) => ({
        url: `/decks/${deckId}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }),
      providesTags: ['Deck'],
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

    getStudyCards: builder.query({
      query: ({ userToken, deckIds }) => ({
        url: `/decks/study/${deckIds}`,
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
      query: ({ userToken, cardId, front, back }) => ({
        url: `/cards/${cardId}`,
        method: 'PUT',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        body: { front, back },
      }),
      invalidatesTags: ['Card'],
    }),

    updateCardDeck: builder.mutation({
      query: ({ userToken, cardId, newDeckId }) => ({
        url: `/cards/${cardId}`,
        method: 'PUT',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        body: { newDeckId },
      }),
      invalidatesTags: ['Card'],
    }),

    updateCardRating: builder.mutation({
      query: ({ userToken, cardId, newRating }) => ({
        url: `/cards/${cardId}/rating`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        body: { newRating },
      }),
      invalidatesTags: ['Card'],
    }),

    deleteCard: builder.mutation({
      query: ({ userToken, cardId }) => ({
        url: `/cards/${cardId}`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }),
      invalidatesTags: ['Card'],
    }),

    createDeck: builder.mutation({
      query: ({ userToken, name }) => ({
        url: '/decks',
        method: 'POST',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        body: { name },
      }),
      invalidatesTags: ['Deck'],
    }),

    updateUserPermission: builder.mutation({
      query: ({ userToken, userEmail, permission, deckId }) => ({
        url: `/decks/${deckId}/permissions`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        body: { userEmail, permission },
      }),
      invalidatesTags: ['Deck'],
    }),

    deleteDeck: builder.mutation({
      query: ({ userToken, deckId }) => ({
        url: `decks/${deckId}`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }),
      invalidatesTags: ['Deck'],
    }),

  }),
});

export const {
  useRegisterUserMutation,
  useSigninUserMutation,
  useGetUserDecksQuery,
  useGetDeckQuery,
  useGetDeckCardsQuery,
  useGetStudyCardsQuery,
  useCreateEmptyCardMutation,
  useUpdateCardMutation,
  useUpdateCardDeckMutation,
  useUpdateCardRatingMutation,
  useDeleteCardMutation,
  useCreateDeckMutation,
  useUpdateUserPermissionMutation,
  useDeleteDeckMutation,
} = apiSlice;
