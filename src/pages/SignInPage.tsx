
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ApiError } from '../services/authService'
import './AuthForm.css'

interface SignInFormData {
    email: string
    password: string
}

function SignInPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [serverError, setServerError] = useState('')

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>()

    async function onSubmit(data: SignInFormData) {
        setServerError('')

        try {
            await login(data)
            navigate('/articles')
        } catch (error) {
            if (error instanceof ApiError) {
                const emailError = error.errors.email?.[0]
                const passwordError = error.errors.password?.[0]

                if (emailError) {
                    setError('email', { message: emailError })
                }

                if (passwordError) {
                    setError('password', { message: passwordError })
                }

                if (!emailError && !passwordError) {
                    setServerError(error.message)
                }
            } else {
                setServerError('Something went wrong. Please try again.')
            }
        }
    }

    return (
        <main className="auth-page">
            <h1 className="auth-page__title">Sign in</h1>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                        autoComplete="current-password"
                        {...register('password', {
                            required: 'Password is required',
                        })}
                    />
                    {errors.password && (
                        <span className="auth-form__error">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {serverError && (
                    <p className="auth-form__server-error">{serverError}</p>
                )}

                <button
                    className="auth-form__submit"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="auth-page__footer">
                Don't have an account? <Link to="/sign-up">Sign up</Link>.
            </p>
        </main>
    )
}

export default SignInPage
