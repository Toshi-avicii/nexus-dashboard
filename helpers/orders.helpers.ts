import api from "@/lib/axios.config";
import { AxiosError } from "axios";

interface GetAllOrdersForAdminParams {
    limit?: number;
    page?: number;
}

export const getAllOrdersForAdmin = async (params: GetAllOrdersForAdminParams) => {
    const query = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== '' && value !== 0) {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString();
    try {
        const reqUrl = `orders/admin/all?${query}`;
        const result = await api.get(reqUrl);
        return result;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}