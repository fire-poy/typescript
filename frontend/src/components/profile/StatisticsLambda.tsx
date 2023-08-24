import styles from './Statistics.module.css'
import StatisticElement from './StatisticElement'
import IconVictoire from '../../assets/icon/victoires.svg'
import IconDefeat from '../../assets/icon/defeats.svg'
import IconRanking from '../../assets/icon/ranking.svg'
import { UserLambdaInformationProps } from '../UserLambda/UserLambdaInformation'

const StatisticsLambda = ({ userData }: UserLambdaInformationProps) => {
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.subtitle}>Statistics</div>
                <div className={styles.horizontalList}>
                    <StatisticElement
                        icon={IconVictoire}
                        text="Victories"
                        number={userData.user.nbVictory}
                    />
                    <StatisticElement
                        icon={IconDefeat}
                        text="Defeats"
                        number={
                            userData.user.totalPlay - userData.user.nbVictory
                        }
                    />
                    <StatisticElement
                        icon={IconRanking}
                        text="Ranking"
                        number={userData.user.userPosition}
                    />
                </div>
            </div>
        </div>
    )
}

export default StatisticsLambda
