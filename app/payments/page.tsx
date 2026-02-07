"use client";

import { useInitiatePayment } from "@/hooks/useInitiatePayment";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PayNowButton() {
    const { mutateAsync, isPending } = useInitiatePayment();

    const handlePayment = async () => {
        try {
            const data = await mutateAsync({
                orderId: "69636eaa7febcd238b3c1c0d",
                // amount: 1,
                paymentType: "full",
            });

            const options = {
                key: data.data.key, // Razorpay Key ID
                amount: (data.data.amount) * 100,
                currency: "INR",
                order_id: data.data.gatewayOrderId,

                handler: function () {
                    // ❌ DO NOTHING IMPORTANT HERE
                    // ✅ Webhook will handle success
                    alert("Payment completed");
                },
            };

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded");
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert((err as Error).message);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={isPending}
            className="px-4 py-2 bg-black text-white rounded"
        >
            {isPending ? "Processing..." : "Pay Now"}
        </button>
    );
}
