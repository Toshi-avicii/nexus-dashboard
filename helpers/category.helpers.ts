import api from "@/lib/axios.config";
import { NewCategory } from "@/types/category.types";
import { AxiosError } from "axios";

export const createCategory = async(data: NewCategory) => {
    try {
        const reqUrl = 'categories';
        const response = await api.post(reqUrl, data);
        return response;
    } catch(err) {
        if(err instanceof AxiosError) {
            console.log(err);
            throw new Error(err.response?.data.error.message);
        } else if(err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export const getCategories = async() => {
    try {
        const reqUrl = 'categories';
        const response = await api.get(reqUrl);
        return response;
    } catch(err) {
        if(err instanceof AxiosError) {
            throw new Error(err.response?.data.error.message);
        } else if(err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export const getCategoryById = async(categoryId: string) => {
    try {
        const reqUrl = `categories/${categoryId}`;
        const response = await api.get(reqUrl);
        return response;
    } catch(err) {
        if(err instanceof AxiosError) {
            throw new Error(err.response?.data.error.message);
        } else if(err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export const updateCategoryById = async(categoryId: string, data: NewCategory) => {
    try {
        const reqUrl = `categories/${categoryId}`;
        const response = await api.put(reqUrl, data);
        return response;
    } catch(err) {
        if(err instanceof AxiosError) {
            throw new Error(err.response?.data.error.message);
        } else if(err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export const deleteCategory = async(categoryId: string) => {
    try {
        const reqUrl = `categories/${categoryId}`;
        const response = await api.delete(reqUrl);
        return response;
    } catch(err) {
        if(err instanceof AxiosError) {
            throw new Error(err.response?.data.error.message);
        } else if(err instanceof Error) {
            throw new Error(err.message);
        }
    }
}