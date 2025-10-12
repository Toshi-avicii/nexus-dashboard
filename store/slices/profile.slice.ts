import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
    id: string;
    username: string;
    email: string;
    dp: string;
    phone: string;
    role: "user" | "admin" | null;
};

const initialState: ProfileState = {
    id: '',
    username: '',
    dp: '',
    email: '',
    phone: '',
    role: null
}

type ProfileReducerParam = Omit<ProfileState, "id"> & { _id: string };

const profileSlice = createSlice({
    initialState,
    name: 'profile',
    reducers: {
        changeProfileWhenRegister: (state, action: PayloadAction<ProfileReducerParam>) => {
            state.id = action.payload._id;
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.phone = action.payload.phone;
            state.role = action.payload.role;
        },
        removeProfile: (state) => {
            state.dp = '';
            state.email = '';
            state.username = '';
            state.role = null;
            state.phone = '';
            state.id = '';
        },
        changeProfileWhenSignIn: (state, action: PayloadAction<ProfileReducerParam>) => {
            state.id = action.payload._id;
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.phone = action.payload.phone;
            state.role = action.payload.role;
        }
    }
});

export const { changeProfileWhenRegister, removeProfile, changeProfileWhenSignIn } = profileSlice.actions;
export default profileSlice.reducer;