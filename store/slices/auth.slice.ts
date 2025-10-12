import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
}

const initialState: AuthState = {
    token: ''
}

const authSlice = createSlice({
    initialState,
    name: "auth",
    reducers: {
        saveToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        removeToken: (state) => {
            state.token = '';
        }
    }
});

export const { removeToken, saveToken } = authSlice.actions;
export default authSlice.reducer;