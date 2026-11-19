
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ApiError, updateUser } from '../services/authService'
import type { UpdateUserData } from '../types/auth'
import './AuthForm.css'
import './SettingsPage.css'

interface SettingsFormData {
    username: string
    email: string
    password: string
    image: string
}

function SettingsPage() {
    const { user, setUser, logout } = useAuth()
    const navigate = useNavigate()
    const [serverError, setServerError] = useState('')
    const [success, setSuccess] = useState('')

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SettingsFormData>({
        defaultValues: {
            username: user?.username ?? '',
            email: user?.email ?? '',
            password: '',
            image: user?.image ?? '',
        },
    })

    async function onSubmit(data: SettingsFormData) {
        if (!user) return

        setServerError('')
        setSuccess('')

        const token = localStorage.getItem('blog-token')

        if (!token) {
            logout()
            navigate('/sign-in')
            return
        }

        const updateData: UpdateUserData = {
            username: data.username,
            email: data.email,
            image: data.image || undefined,
        }

        if (data.password) {
            updateData.password = data.password
        }

        try {
            const response = await updateUser(updateData, token)

            setUser(response.user)
            localStorage.setItem('blog-token', response.user.token)
            setSuccess('Your profile has been updated successfully.')
        } catch (error) {
            if (error instanceof ApiError) {
                const fields = ['username', 'email', 'password', 'image'] as const
                let hasFieldError = false

                fields.forEach((field) => {
                    const message = error.errors[field]?.[0]

                    if (message) {
                        setError(field, { message })
                        hasFieldError = true
                    }
                })

                if (!hasFieldError) {
                    setServerError(error.message)
                }
            } else {
                setServerError('Something went wrong. Please try again.')
            }
        }
    }

    return (
        <main className="auth-page">
            <h1 className="auth-page__title">Your Settings</h1>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="auth-form__field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        className={`auth-form__input ${errors.username ? 'auth-form__input--error' : ''}`}
                        {...register('username', {
                            required: 'Username is required',
                            minLength: {
                                value: 3,
                                message: 'Username must contain at least 3 characters',
                            },
                            maxLength: {
                                value: 20,
                                message: 'Username must not exceed 20 characters',
                            },
                        })}
                    />
                    {errors.username && (
                        <span className="auth-form__error">{errors.username.message}</span>
                    )}
                </div>

                <div className="auth-form__field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className={`auth-form__input ${errors.email ? 'auth-form__input--error' : ''}`}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address',
                            },
                        })}
                    />
                    {errors.email && (
                        <span className="auth-form__error">{errors.email.message}</span>
                    )}
                </div>

                <div className="auth-form__field">
                    <label htmlFor="password">New password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Leave blank to keep your current password"
                        autoComplete="new-password"
                        className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
                        {...register('password', {
                            validate: (value) =>
                                !value ||
                                (value.length >= 6 && value.length <= 40) ||
                                'Password must contain 6–40 characters',
                        })}
                    />
                    {errors.password && (
                        <span className="auth-form__error">{errors.password.message}</span>
                    )}
                </div>

                <div className="auth-form__field">
                    <label htmlFor="image">Avatar image URL</label>
                    <input
                        id="image"
                        type="url"
                        className={`auth-form__input ${errors.image ? 'auth-form__input--error' : ''}`}
                        {...register('image', {
                            validate: (value) => {
                                if (!value) return true

                                try {
                                    const url = new URL(value)
                                    return (
                                        url.protocol === 'http:' ||
                                        url.protocol === 'https:'
                                    ) || 'Enter a valid image URL'
                                } catch {
                                    return 'Enter a valid image URL'
                                }
                            },
                        })}
                    />
                    {errors.image && (
                        <span className="auth-form__error">{errors.image.message}</span>
                    )}
                </div>

                {serverError && (
                    <p className="auth-form__server-error">{serverError}</p>
                )}

                {success && <p className="settings-page__success">{success}</p>}

                <button
                    className="auth-form__submit"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save settings'}
                </button>
            </form>

            <div className="settings-page__logout">
                <button
                    type="button"
                    onClick={() => {
                        logout()
                        navigate('/articles')
                    }}
                >
                    Log out
                </button>
            </div>

            <p className="auth-page__footer">
                <Link to="/articles">Back to articles</Link>
            </p>
        </main>
    )
}

export default SettingsPage
