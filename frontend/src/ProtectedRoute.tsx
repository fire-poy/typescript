import { Navigate } from 'react-router-dom'
import { useAppSelector } from './store/types'

interface ProtectedRouteProps {
    children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const logStatus = useAppSelector((state) => state.auth.logStatus)

    if (logStatus === 'isNotLogged') {
        return <Navigate to="/" replace />
    }
    if (logStatus === 'need2fa') {
        return <Navigate to="/TFAVerify" replace />
    }

    return children
}

export default ProtectedRoute
