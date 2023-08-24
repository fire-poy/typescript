import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './pages/SignIn'
import MainProfile, { loader as userLoader } from './pages/MainProfile'
import MatchHistory from './pages/MatchHistory'
import Game from './pages/Game'
import RootLayout, { loader as RootLoader } from './RootLayout'
import Chat from './pages/Chat'
import ErrorPage from './components/error/Error'
import ProtectedRoute from './ProtectedRoute'
import TFAVerify from './pages/TFAAuthenticate'
import TFATurnOn from './pages/TFATurnOn'
import UserLambda from './pages/UserLambda'
import ProtectedSignIn from './ProtectedSignIn'
import Play from './pages/Play'

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        loader: RootLoader,
        children: [
            {
                index: true,
                element: (
                    <ProtectedSignIn>
                        <SignIn />
                    </ProtectedSignIn>
                ),
            },
            {
                path: 'profile',
                loader: userLoader,
                element: (
                    <ProtectedRoute>
                        <MainProfile />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'history',
                loader: userLoader,
                element: (
                    <ProtectedRoute>
                        <MatchHistory />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'game',
                loader: userLoader,
                element: (
                    <ProtectedRoute>
                        <Game />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'chat',
                loader: userLoader,
                element: (
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'TFATurnOn',
                element: <TFATurnOn />,
            },
            {
                path: 'user/:nickname',
                loader: userLoader,
                element: (
                    <ProtectedRoute>
                        <UserLambda />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'play',
                loader: userLoader,
                element: (
                    <ProtectedRoute>
                        <Play />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: 'TFAVerify',
        element: <TFAVerify />,
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
