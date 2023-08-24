import { MatchList } from '../components/history/MatchList'
import { useAppSelector } from '../store/types'
import { UserData } from '../types/UserData'
import InvitationHandler from '../sockets/InvitationHandler'

const MatchHistory = () => {
    const userData: UserData = useAppSelector(
        (state) => state.user.userData
    ) as UserData

    return (
        <div>
            <InvitationHandler />
            <MatchList userData={userData} isInUserLambda={false} />
        </div>
    )
}

export default MatchHistory
