import api from "@/lib/axios.config";
import { SignInFormData, SignUpFormData } from "@/types/auth.types";
import { AxiosError } from 'axios';

// sign up user
export const signUp = async(signUpData: SignUpFormData) => {
    try {
        const reqUrl = 'auth/register';
        const response = await api.post(reqUrl, signUpData);
        return response;
    } catch(err) {
        if(err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if(err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

// login user
export const login = async({ email, password }: SignInFormData) => {
    try {
        const reqUrl = 'auth/login';
        const response = await api.post(reqUrl, { email, password });
        return response;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data?.message)
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

// get user data
export const getProfile = async() => {
    try {
        const reqUrl = 'users/me';
        const response = await api.get(reqUrl);
        return response;
    } catch(err) {
        if(err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if(err instanceof Error) {
            throw new Error(err.message);
        }
    }   
}