import { createSlice } from '@reduxjs/toolkit'

const chatInitialState = {
    currentChatSelected: 0,
    type: '',
}

const chatSlice = createSlice({
    name: 'chat',
    initialState: chatInitialState,
    reducers: {
        updateChat(state, action) {
            const { currentChatSelected, type } = action.payload
            state.currentChatSelected = currentChatSelected
            state.type = type
        },
    },
})

export default chatSlice

export const chatActions = chatSlice.actions
