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

export type me = { 
    email : string
    govUsername : string
    role : string
    firstName: string
    lastName:string 
}

export type LoginResponse = { 
    email : string
    govUsername : string
    role : string
    firstName: string
    lastName:string 
}

export type RegisterInput = {
    email: string;
    password : string;
    govUsername : string
    firstName : string
    lastName :string 
    phone : string 
}

export type RegisterResponse = { 
    Register : string
    newUser : string
}
