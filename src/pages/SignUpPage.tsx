
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ApiError } from '../services/authService'
import './AuthForm.css'

interface SignUpFormData {
    username: string
    email: string
    password: string
    confirmPassword: string
    agree: boolean
}

function SignUpPage() {
    const { register: signUp } = useAuth()
    const navigate = useNavigate()
    const [serverError, setServerError] = useState('')

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>()

    const password = watch('password')

    async function onSubmit(data: SignUpFormData) {
        setServerError('')

        try {
            await signUp({
                username: data.username,
                email: data.email,
                password: data.password,
            })

            navigate('/articles')
        } catch (error) {
            if (error instanceof ApiError) {
                const fieldNames = ['username', 'email', 'password'] as const
                let hasFieldError = false

                fieldNames.forEach((field) => {
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
            <h1 className="auth-page__title">Create an account</h1>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="auth-form__field">
                    <input
                        className={`auth-form__input ${errors.username ? 'auth-form__input--error' : ''}`}
                        placeholder="Username"
                        autoComplete="username"
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
                        <span className="auth-form__error">
                            {errors.username.message}
                        </span>
                    )}
                </div>

                <div className="auth-form__field">
                    <input
                        className={`auth-form__input ${errors.email ? 'auth-form__input--error' : ''}`}
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address',
                            },
                        })}
                    />
                    {errors.email && (
                        <span className="auth-form__error">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div className="auth-form__field">
                    <input
                        className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must contain at least 6 characters',
                            },
                            maxLength: {
                                value: 40,
                                message: 'Password must not exceed 40 characters',
                            },
                        })}
                    />
                    {errors.password && (
                        <span className="auth-form__error">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                <div className="auth-form__field">
                    <input
                        className={`auth-form__input ${errors.confirmPassword ? 'auth-form__input--error' : ''}`}
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        {...register('confirmPassword', {
                            required: 'Please repeat your password',
                            validate: (value) =>
                                value === password || 'Passwords do not match',
                        })}
                    />
                    {errors.confirmPassword && (
                        <span className="auth-form__error">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>

                <label className="auth-form__checkbox">
                    <input
                        type="checkbox"
                        {...register('agree', {
                            required: 'You must agree before registering',
                        })}
                    />
                    <span>
                        I agree to the processing of my personal data.
                    </span>
                </label>
                {errors.agree && (
                    <span className="auth-form__error">
                        {errors.agree.message}
                    </span>
                )}

                {serverError && (
                    <p className="auth-form__server-error">{serverError}</p>
                )}

                <button
                    className="auth-form__submit"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </button>
            </form>

            <p className="auth-page__footer">
                Already have an account? <Link to="/sign-in">Sign in</Link>.
            </p>
        </main>
    )
}

export default SignUpPage
