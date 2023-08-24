import styles from './MainSection.module.css'
import SignInBtn from './SignInBtn'

const MainSection = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Cosmic Pong</h1>
            <p className={styles.p}>
                The coolest way to play pong and test our skills as developers
                at the same time
            </p>
            <SignInBtn></SignInBtn>
        </div>
    )
}

export default MainSection
