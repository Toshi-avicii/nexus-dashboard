export type SignInFormData = {
    email: string;
    password: string;
}

export interface SignUpFormData {
    username: string;
    email: string;
    phone: string;
    role: "user" | "admin";
    password: string;
}