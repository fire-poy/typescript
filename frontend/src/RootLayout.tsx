import { Outlet } from 'react-router-dom'
import Navbar from './components/navigation/Navbar'
import { authActions } from './store/auth'
import store from './store'

const RootLayout = () => {
    return (
        <>
            <Navbar></Navbar>
            <main>
                <Outlet></Outlet>
            </main>
        </>
    )
}

export default RootLayout

export async function loader() {
    const response = await fetch('http://localhost:8080/api/auth/loginStatus', {
        credentials: 'include',
    })
    if (response.status !== 200) {
        throw new Response(JSON.stringify({ message: 'Error fetching data' }), {
            status: 400,
        })
    }
    const data = await response.json()
    if (data.status === 'isLogged') {
        store.dispatch(authActions.login())
    } else if (data.status === 'need2fa') {
        store.dispatch(authActions.setNeed2fa())
    } else {
        store.dispatch(authActions.logout())
    }
    return data
}
