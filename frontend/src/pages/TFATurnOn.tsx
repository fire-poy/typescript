import TwoFactorVerificationBox from '../components/TFAVerify/TwoFactorVerificationBox'
import styles from './TFA.module.css'
import CodeQR from '../components/TFATurnOn/CodeQR'

const TFATurnOn = () => {
    const url = 'http://localhost:8080/api/auth/2fa/turn-on'

    return (
        <div className={styles.container}>
            <CodeQR />
            <TwoFactorVerificationBox url={url} logOutButton={false} />
        </div>
    )
}

export default TFATurnOn
