import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth'
import userSlice from './user'
import chatSlice from './chat'

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        user: userSlice.reducer,
        chat: chatSlice.reducer,
    },
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
