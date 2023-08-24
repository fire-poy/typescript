import { Navigate } from 'react-router-dom'
import { useAppSelector } from './store/types'

interface ProtectedRouteProps {
    children: JSX.Element
}

const ProtectedSignIn = ({ children }: ProtectedRouteProps) => {
    const logStatus = useAppSelector((state) => state.auth.logStatus)

    if (logStatus === 'isLogged') {
        return <Navigate to="/profile" replace />
    }
    if (logStatus === 'need2fa') {
        return <Navigate to="/TFAVerify" replace />
    }

    return children
}

export default ProtectedSignIn
