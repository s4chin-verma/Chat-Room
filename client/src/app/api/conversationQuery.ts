import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import type { Conversation, AddMessageRequest } from '@/lib/types/redux';

export const conversationsApi = createApi({
  reducerPath: 'conversationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Conversation'],
  endpoints: builder => ({
    getOrCreateConversation: builder.mutation<Conversation, { user1: string; user2: string }>({
      query: body => ({
        url: '/api/chat/conversations',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    addMessageToServer: builder.mutation<void, { conversationId: string; body: AddMessageRequest }>(
      {
        query: ({ conversationId, body }) => ({
          url: `/api/chat/conversations/${conversationId}`,
          method: 'PUT',
          body,
        }),
      }
    ),
  }),
});

export const { useGetOrCreateConversationMutation, useAddMessageToServerMutation } =
  conversationsApi;
