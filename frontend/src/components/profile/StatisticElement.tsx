import styles from './StatisticElement.module.css'

interface StatisticElementProps {
    icon: string
    text: string
    number: number
}

const StatisticElement = ({ icon, text, number }: StatisticElementProps) => {
    return (
        <div className={styles.container}>
            <img src={icon} alt="Icon" className={styles.icon} />
            <p>{text}</p>
            <p className={styles.number}>{number}</p>
        </div>
    )
}

export default StatisticElement
