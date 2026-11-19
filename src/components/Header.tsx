
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './Header.css'

function Header() {
    const { user, logout, isLoading } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/articles')
    }

    return (
        <header className="header">
            <Link to="/articles" className="header__logo">
                Realworld Blog
            </Link>

            {!isLoading && (
                <nav className="header__nav">
                    {user ? (
                        <>
                            <Link to="/articles" className="header__link">
                                Articles
                            </Link>

                            <Link to="/settings" className="header__link">
                                Settings
                            </Link>

                            <Link to="/profile" className="header__user">
                                {user.image && (
                                    <img src={user.image} alt="" />
                                )}
                                <span>{user.username}</span>
                            </Link>

                            <button
                                type="button"
                                className="header__logout"
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/sign-in" className="header__link">
                                Sign in
                            </Link>

                            <Link to="/sign-up" className="header__signup">
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            )}
        </header>
    )
}

export default Header
