
export interface User {
    email: string
    token: string
    username: string
    bio: string | null
    image: string | null
}

export interface UserResponse {
    user: User
}

export interface AuthCredentials {
    email: string
    password: string
}

export interface RegisterData extends AuthCredentials {
    username: string
}

export interface UpdateUserData {
    username?: string
    email?: string
    password?: string
    image?: string
    bio?: string
}

export interface ApiErrorResponse {
    errors?: Record<string, string[]>
}
