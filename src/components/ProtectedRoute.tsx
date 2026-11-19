
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function ProtectedRoute() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <p>Loading...</p>
    }

    return user ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export default ProtectedRoute
