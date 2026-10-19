import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./constant";

/**
 * RTK Query API Slice
 * Centralizes all data fetching logic, providing automatic caching, 
 * loading states, and error handling for the entire application.
 */
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ["Feed", "Connections", "Requests", "User", "Chat", "Notifications"],
    endpoints: (builder) => ({
        // User Profile
        getProfile: builder.query({
            query: () => ({
                url: "/profile/view",
                credentials: "include",
            }),
            providesTags: ["User"],
        }),

        // Discover Developers (Feed)
        getFeed: builder.query({
            query: () => ({
                url: "/feed",
                credentials: "include",
            }),
            providesTags: ["Feed"],
        }),

        // Connection Management
        getConnections: builder.query({
            query: () => ({
                url: "/user/connections",
                credentials: "include",
            }),
            providesTags: ["Connections"],
        }),

        // Request Management
        getRequests: builder.query({
            query: ({ page = 1, limit = 4 } = {}) => ({
                url: `/user/requests/received?page=${page}&limit=${limit}`,
                credentials: "include",
            }),
            providesTags: ["Requests"],
        }),

        getSentRequests: builder.query({
            query: ({ page = 1, limit = 4 } = {}) => ({
                url: `/user/requests/sent?page=${page}&limit=${limit}`,
                credentials: "include",
            }),
            providesTags: ["Requests"],
        }),

        // Chat History with Cursor-Based Pagination
        getChat: builder.query({
            query: ({ targetUserId, before }) => ({
                url: `/chat/${targetUserId}${before ? `?before=${before}` : ""}`,
                credentials: "include",
            }),
            transformResponse: (response) => {
                const PAGE_SIZE = 20;
                const messages = response?.messages?.map((msg) => ({
                    _id: msg?._id,
                    senderId: msg?.senderId?._id || msg?.senderId, // Support both populated and raw IDs
                    firstName: msg?.senderId?.firstName,
                    lastName: msg?.senderId?.lastName,
                    photoUrl: msg?.senderId?.photoUrl,
                    text: msg?.text,
                    messageType: msg?.messageType || "text",
                    fileUrl: msg?.fileUrl,
                    fileName: msg?.fileName,
                    status: "sent",
                    createdAt: msg?.createdAt
                })) || [];
                return {
                    chatId: response?.chatId,
                    messages,
                    hasMore: messages.length >= PAGE_SIZE // If we got a full page, there might be more
                };
            },
            // Unify the cache key so all pages merge into the exact same chat object
            serializeQueryArgs: ({ queryArgs }) => {
                return queryArgs.targetUserId;
            },
            // Merge newly fetched (older) messages to the FRONT of the cache
            merge: (currentCache, newItems, { arg }) => {
                if (arg.before) {
                    // Prepend older messages; preserve chatId from the initial load
                    return {
                        chatId: currentCache.chatId ?? newItems.chatId,
                        messages: [...newItems.messages, ...currentCache.messages],
                        hasMore: newItems.hasMore
                    };
                }
                return newItems; // Initial load: replace the cache completely
            },
            // Force refetch only when the cursor actually changes
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.before !== previousArg?.before;
            },
            providesTags: (result, error, arg) => [{ type: "Chat", id: arg.targetUserId }],
        }),

        // Mutations (Actions that change data)
        signChatUpload: builder.mutation({
            query: () => ({
                url: "/chat/sign-upload",
                method: "POST",
                credentials: "include",
            }),
        }),

        sendConnectionRequest: builder.mutation({
            query: ({ status, userId }) => ({
                url: `/request/send/${status}/${userId}`,
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["Feed", "Connections"],
        }),

        reviewConnectionRequest: builder.mutation({
            query: ({ status, requestId }) => ({
                url: `/request/review/${status}/${requestId}`,
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["Requests", "Connections", "Feed"],
        }),

        withdrawConnectionRequest: builder.mutation({
            query: (requestId) => ({
                url: `/request/withdraw/${requestId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Requests", "Feed"],
        }),

        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: "/profile/edit",
                method: "PATCH",
                body: profileData,
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),

        // Notifications
        getNotifications: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: `/notifications?page=${page}&limit=${limit}`,
                credentials: "include",
            }),
            providesTags: ["Notifications"],
        }),

        markNotificationsAsRead: builder.mutation({
            query: () => ({
                url: "/notifications/read-all",
                method: "PATCH",
                credentials: "include",
            }),
            invalidatesTags: ["Notifications"],
        }),

        subscribePush: builder.mutation({
            query: (subscription) => ({
                url: "/notifications/subscribe",
                method: "POST",
                body: subscription,
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useGetProfileQuery,
    useGetFeedQuery,
    useGetConnectionsQuery,
    useGetRequestsQuery,
    useGetSentRequestsQuery,
    useGetChatQuery,
    useSendConnectionRequestMutation,
    useReviewConnectionRequestMutation,
    useWithdrawConnectionRequestMutation,
    useUpdateProfileMutation,
    useSignChatUploadMutation,
    useGetNotificationsQuery,
    useMarkNotificationsAsReadMutation,
    useSubscribePushMutation
} = apiSlice;
