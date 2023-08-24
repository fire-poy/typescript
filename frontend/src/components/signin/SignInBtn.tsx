import styles from './SignInBtn.module.css'

const SignInBtn = () => {
    return (
        <a
            href="http://localhost:8080/api/auth/42"
            className={styles['oauth-button']}
        >
            Sign-in with 42
        </a>
    )
}

export default SignInBtn
