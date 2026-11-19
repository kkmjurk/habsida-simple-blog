
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './ProfilePage.css'

function ProfilePage() {
    const { user } = useAuth()

    if (!user) {
        return null
    }

    return (
        <main className="profile-page">
            <section className="profile-card">
                {user.image ? (
                    <img
                        className="profile-card__avatar"
                        src={user.image}
                        alt={`${user.username}'s avatar`}
                    />
                ) : (
                    <div className="profile-card__avatar profile-card__avatar--empty">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                )}

                <h1 className="profile-card__username">{user.username}</h1>

                <p className="profile-card__email">{user.email}</p>

                {user.bio && <p className="profile-card__bio">{user.bio}</p>}

                <Link to="/settings" className="profile-card__settings">
                    Edit profile
                </Link>
            </section>
        </main>
    )
}

export default ProfilePage
