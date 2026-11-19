
import type {
    AuthCredentials,
    RegisterData,
    UpdateUserData,
    UserResponse,
} from '../types/auth'

const API_URL = 'https://realworld.habsida.net/api'

export class ApiError extends Error {
    errors: Record<string, string[]>

    constructor(
        message: string,
        errors: Record<string, string[]> = {},
    ) {
        super(message)
        this.name = 'ApiError'
        this.errors = errors
    }
}

async function request(
    endpoint: string,
    options: RequestInit = {},
    token?: string,
): Promise<UserResponse> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Token ${token}` } : {}),
            ...options.headers,
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new ApiError(
            data.errors
                ? Object.values(data.errors).flat().join(' ')
                : 'Something went wrong. Please try again.',
            data.errors ?? {},
        )
    }

    return data as UserResponse
}

export function registerUser(data: RegisterData) {
    return request('/users', {
        method: 'POST',
        body: JSON.stringify({ user: data }),
    })
}

export function loginUser(data: AuthCredentials) {
    return request('/users/login', {
        method: 'POST',
        body: JSON.stringify({ user: data }),
    })
}

export function getCurrentUser(token: string) {
    return request('/user', { method: 'GET' }, token)
}

export function updateUser(data: UpdateUserData, token: string) {
    return request(
        '/user',
        {
            method: 'PUT',
            body: JSON.stringify({ user: data }),
        },
        token,
    )
}
