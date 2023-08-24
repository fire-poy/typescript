import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
    logStatus: 'isLogged' | 'isNotLogged' | 'need2fa'
}

const authInitialState: AuthState = { logStatus: 'isNotLogged' }

const authSlice = createSlice({
    name: 'auth',
    initialState: authInitialState,
    reducers: {
        login(state) {
            state.logStatus = 'isLogged'
        },
        logout(state) {
            state.logStatus = 'isNotLogged'
        },
        setNeed2fa(state) {
            state.logStatus = 'need2fa'
        },
    },
})

export default authSlice

export const authActions = authSlice.actions
