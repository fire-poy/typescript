import { createSlice } from '@reduxjs/toolkit'

const userInitialState = { userData: {} }
const userSlice = createSlice({
    name: 'user',
    initialState: userInitialState,
    reducers: {
        update(state, action) {
            state.userData = action.payload
        },
    },
})

export default userSlice

export const userActions = userSlice.actions
