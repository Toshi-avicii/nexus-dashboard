export type FetchedOrder = {
    _id: string,
    user: {
        _id: string,
        username: string,
        email: string
    },
    items: {
        name: string,
        discount: number,
        product: string,
        quantity: number,
        price: number
    }[],
    totalAmount: number,
    status: string,
    shippingAddress: {
        street: string,
        city: string,
        state: string,
        country: string,
        postalCode: string
    },
    payment: string[],
    paidAmount: number,
    outstandingAmount: number,
    paymentStatus: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}
