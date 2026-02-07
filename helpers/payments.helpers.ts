import api from "@/lib/axios.config";
import { AxiosError } from "axios";

export async function initiatePayment({
  // amount,
  paymentType,
  orderId,
  installmentNo,
}: {
  // amount: number;
  paymentType: "full" | "emi";
  orderId: string;
  installmentNo?: number;
}) {
  try {
    const reqUrl = "payments";

    const result = await api.post(reqUrl, {
      // amount,
      paymentType, // this is received on the backend.
      orderId, // this is received on the backend
      installmentNo, 
      method: "upi" // this is received on the backend
    });

    return result.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log(err);
      throw new Error(err.response?.data?.message || err.response?.data?.error?.message || "Payment initiation failed");
    } else if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
}
