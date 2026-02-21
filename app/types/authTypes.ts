export type UserState = {
    id: string
    name: string
    email: string
    csrf: string
    loading: boolean
}

export type LoginInput = {
    email: string;
    password: string
}

export type RegisterInput = {
    email: string;
    password : string;
    username : string
}