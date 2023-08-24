import { Channel } from '../../../types/Channel'
import ChannelType from '../../../types/ChannelType'
import DmDisplay from './dmChannels/DmDisplay'
import DiscoverDisplay from './discoverChannels/DiscoverDisplay'
import JoinedDisplay from './joinedChannels/JoinedDisplay'
import styles from './ChannelList.module.css'
import { useAppSelector } from '../../../store/types'
import { User, UserData } from '../../../types/UserData'
import { Socket } from 'socket.io-client'
import { useAppDispatch } from '../../../store/types'
import { chatActions } from '../../../store/chat'

interface ChannelListProps {
    allChan: Channel[] | []
    socket: Socket | undefined
}

const ChannelList = (props: ChannelListProps) => {
    const dispatch = useAppDispatch()
    const userData = useAppSelector((state) => state.user.userData) as UserData
    let allUserChan: Channel[] | [] = []
    let myDms: Channel[] | [] = []
    let joinedButNotDms: Channel[] | [] = []
    let notJoinedChan: Channel[] | [] = []
    let notJoinedAndNotDms: Channel[] | [] = []

    if (props.allChan.length !== 0) {
        allUserChan = props.allChan.filter((chan: Channel) =>
            chan.users.some((user: User) => user.id === userData.user.id)
        )

        notJoinedChan = props.allChan.filter((chan) =>
            chan.users.every((user: User) => user.id !== userData.user.id)
        )

        const myNickname = userData.user.nickname

        const changeName = (channel: Channel) => {
            const name = channel.name
            const nameArray = name.split(' & ')
            const index = nameArray.indexOf(myNickname)
            if (index === 0) channel.name = nameArray[1]
            else channel.name = nameArray[0]
        }

        myDms = allUserChan
            .filter((channel) => channel.type === ChannelType.Direct)
            .map((channel) => {
                changeName(channel)
                return channel
            })

        joinedButNotDms = allUserChan.filter(
            (channel) => channel.type !== ChannelType.Direct
        )

        notJoinedAndNotDms = notJoinedChan.filter(
            (channel) => channel.type !== ChannelType.Direct
        )
    }

    const leaveChannel = (channelId: number) => {
        if (props.socket !== undefined) {
            props.socket.emit(
                'leaveChannel',
                channelId,
                userData.user.id,
                () => {
                    dispatch(
                        chatActions.updateChat({
                            currentChatSelected: 0,
                            type: '',
                        })
                    )
                }
            )
        }
    }
    const deleteChannel = (channelId: number) => {
        if (props.socket !== undefined) {
            props.socket.emit(
                'deleteChannel',
                channelId,
                userData.user.id,
                () => {
                    dispatch(
                        chatActions.updateChat({
                            currentChatSelected: 0,
                            type: '',
                        })
                    )
                }
            )
        }
    }

    const joinChannel = (channelId: number, password: string) => {
        if (props.socket !== undefined) {
            props.socket.emit(
                'joinChannel',
                channelId,
                userData.user.id,
                password,
                () => {
                    dispatch(
                        chatActions.updateChat({
                            currentChatSelected: channelId,
                            type: '',
                        })
                    )
                }
            )
        }
    }

    const changePassword = (channelId: number, password: string) => {
        if (props.socket !== undefined) {
            props.socket.emit(
                'changePassword',
                channelId,
                password,
                (response: boolean) => {
                    if (!response)
                        alert('Could not change password, please try again')
                }
            )
        }
    }

    return (
        <div className={styles.listsContainer}>
            <div className={styles.list}>
                <h2> Joined Channels </h2>
                <JoinedDisplay
                    channels={joinedButNotDms}
                    deleteChannel={deleteChannel}
                    leaveChannel={leaveChannel}
                    changePassword={changePassword}
                ></JoinedDisplay>
            </div>
            <div className={styles.list}>
                <h2> Discover </h2>
                <DiscoverDisplay
                    channels={notJoinedAndNotDms}
                    joinChannel={joinChannel}
                ></DiscoverDisplay>
            </div>
            <div className={styles.list}>
                <h2> DM </h2>
                <DmDisplay
                    channels={myDms}
                    deleteChannel={deleteChannel}
                    leaveChannel={leaveChannel}
                ></DmDisplay>
            </div>
        </div>
    )
}

export default ChannelList
