export function generateInrAmount(amount: number): string {
    const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount);

    return formatted;
}