import styles from './Navbar.module.css'
import { NavLink } from 'react-router-dom'
import Logo from '../../assets/icon/42.svg'
import { useAppSelector } from '../../store/types'
import LogoutButton from './LogOutButton'

const Navbar = () => {
    const isLoggedIn = useAppSelector((state) => state.auth.logStatus)
    return (
        <header>
            <nav className={styles.nav}>
                <div className={styles.container}>
                    <div className={styles.leftcontainer}>
                        {isLoggedIn === 'isLogged' && (
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    isActive ? styles.active : undefined
                                }
                            >
                                Profile
                            </NavLink>
                        )}
                        {isLoggedIn === 'isLogged' && (
                            <NavLink
                                to="/history"
                                className={({ isActive }) =>
                                    isActive ? styles.active : undefined
                                }
                            >
                                Match history
                            </NavLink>
                        )}
                        {isLoggedIn === 'isLogged' && (
                            <NavLink
                                to="/chat"
                                className={({ isActive }) =>
                                    isActive ? styles.active : undefined
                                }
                            >
                                Chat
                            </NavLink>
                        )}
                        {isLoggedIn === 'isLogged' && (
                            <NavLink
                                to="/play"
                                className={({ isActive }) =>
                                    isActive ? styles.active : undefined
                                }
                            >
                                Play
                            </NavLink>
                        )}
                    </div>
                    <div className={styles.centerContainer}>
                        {' '}
                        {isLoggedIn === 'isLogged' && (
                            <LogoutButton></LogoutButton>
                        )}
                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.imgContainer}>
                            <a href="https://42lausanne.ch/" target="_blank">
                                <img src={Logo} alt="42 logo" />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
