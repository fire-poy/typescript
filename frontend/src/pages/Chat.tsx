import styles from './Chat.module.css'
import ChannelBox from '../components/chat/channelBox/ChannelBox.tsx'
import ChatBox from '../components/chat/chatBox/ChatBox'
import UserBox from '../components/chat/userBox/UserBox.tsx'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/types'
import { chatActions } from '../store/chat'
import { User, UserData } from '../types/UserData'
import { Channel } from '../types/Channel'
import SocketChatService from '../sockets/SocketChat.ts'
import { Socket } from 'socket.io-client'
import InvitationHandler from '../sockets/InvitationHandler'

export interface ReceivedMsg {
    id: number
    content: string
    creator: number
    userNickname: string
    userAvatarUrl: string
}

export interface NewMsg {
    creator: number
    content: string
    channelId: number
}

const Chat = () => {
    const dispatch = useAppDispatch()
    const userData = useAppSelector((state) => state.user.userData) as UserData
    const currentChatSelected = useAppSelector(
        (state) => state.chat.currentChatSelected
    ) as number
    const [allChan, setAllChan] = useState<Channel[]>([])
    const [messages, setMesssages] = useState<ReceivedMsg[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [blockedUsers, setBlockedUsers] = useState<number[]>([])
    const [admins, setAdmins] = useState<any[]>([])
    const [owner, setOwner] = useState()
    const [bannedUsers, setBannedUsers] = useState<any[]>([])
    const [mutedUsers, setMutedUsers] = useState<number[]>([])
    const [isDM, setIsDM] = useState<boolean>(false)

    const [reload, setReload] = useState(false)
    const [reloadChannels, setReloadChannels] = useState(false)
    const [reloadUsers, setReloadUsers] = useState(false)
    const [reloadFeed, setReloadFeed] = useState(false)
    const [socket, setSocket] = useState<Socket>()

    useEffect(() => {
        const newSocket = SocketChatService.getInstance().connect()
        if (newSocket !== undefined) {
            setSocket(newSocket)

            newSocket.on('reload', () => {
                setTimeout(() => {
                    setReload(true)
                }, 300)
            })

            newSocket.on('reloadChannels', () => {
                setReloadChannels(true)
            })

            newSocket.on('reloadUsers', () => {
                setReloadUsers(true)
            })

            newSocket.on('reloadFeed', () => {
                setReloadFeed(true)
            })

            return () => {
                newSocket.off('reload')
                newSocket.off('reloadChannels')
                newSocket.off('reloadUsers')
                newSocket.off('reloadFeed')
            }
        } else {
            console.log('Socket not connected')
        }
    }, [])

    useEffect(() => {
        if (socket !== undefined) {
            getAllChannels()
        }
    }, [socket])

    useEffect(() => {
        getAllChannels()
        if (currentChatSelected) {
            getAllMsg()
            getChUsers()
            getBlockedUsers()
            getMutedUsers()
            allChan.find(
                (ch) => ch.id === currentChatSelected && ch.type === 'direct'
            )
                ? setIsDM(true)
                : setIsDM(false)
        } else {
            setMesssages([])
            setUsers([])
            setAdmins([])
            setBlockedUsers([])
            setBannedUsers([])
            setMutedUsers([])
        }
    }, [currentChatSelected])

    useEffect(() => {
        if (reload) {
            getAllChannels()
            getAllMsg()
            getChUsers()
            getBlockedUsers()
            getMutedUsers()
            allChan.find(
                (ch) => ch.id === currentChatSelected && ch.type === 'direct'
            )
                ? setIsDM(true)
                : setIsDM(false)
        }
        setReload(false)
    }, [reload])

    useEffect(() => {
        if (reloadChannels) {
            getAllChannels()
        }
        setReloadChannels(false)
    }, [reloadChannels])

    useEffect(() => {
        if (currentChatSelected && reloadFeed) {
            getAllMsg()
        }
        setReloadFeed(false)
    }, [reloadFeed])

    useEffect(() => {
        if (currentChatSelected && reloadUsers) {
            getChUsers()
            getBlockedUsers()
            getMutedUsers()
            allChan.find(
                (ch) => ch.id === currentChatSelected && ch.type === 'direct'
            )
                ? setIsDM(true)
                : setIsDM(false)
        }
        setReloadUsers(false)
    }, [reloadUsers])

    // MESSAGE HANDLING

    const getAllMsg = () => {
        if (socket !== undefined) {
            socket.emit(
                'findAllMsgByChannel',
                currentChatSelected,
                (response: ReceivedMsg[]) => {
                    setMesssages(response)
                }
            )
        }
    }

    const sendMessage = (newMsg: NewMsg) => {
        if (socket !== undefined) socket.emit('postMsg', newMsg, () => {})
    }

    // CHANNEL HANDLING

    const getAllChannels = () => {
        if (socket !== undefined) {
            socket.emit('getAllChannels', (response: any) => {
                const allChannels = response
                if (
                    !allChannels.some(
                        (ch: Channel) => ch.id === currentChatSelected
                    )
                ) {
                    dispatch(
                        chatActions.updateChat({
                            currentChatSelected: 0,
                            type: '',
                        })
                    )
                }
                setAllChan(allChannels)
            })
        }
    }

    // USER HANDLING

    const getChUsers = () => {
        if (socket !== undefined) {
            socket.emit(
                'findUsersByChannel',
                currentChatSelected,
                (response: any) => {
                    setTimeout(() => {
                        setUsers(response.users)
                        if (
                            !response.users.some(
                                (u: User) => u.id === userData.user.id
                            )
                        ) {
                            dispatch(
                                chatActions.updateChat({
                                    currentChatSelected: 0,
                                    type: '',
                                })
                            )
                        }
                        setAdmins(response.admin)
                        setOwner(response.owner)
                        if (response.banned) {
                            setBannedUsers(response.banned)
                        } else setBannedUsers([])
                    }, 300)
                }
            )
        }
    }

    const getBlockedUsers = () => {
        if (socket !== undefined) {
            socket.emit(
                'getBlockedUsers',
                userData.user.id,
                (response: any) => {
                    setBlockedUsers(response)
                }
            )
        }
    }

    const getMutedUsers = () => {
        if (socket !== undefined) {
            socket.emit(
                'getMutedUsers',
                currentChatSelected,
                (response: number[]) => {
                    setMutedUsers(response)
                }
            )
        }
    }

    return (
        <div>
            <InvitationHandler />
            <div className={styles.chatContainer}>
                <ChannelBox allChan={allChan} socket={socket} />
                <ChatBox
                    currentChatSelected={currentChatSelected}
                    messages={messages}
                    sendMessage={sendMessage}
                    amImuted={mutedUsers.includes(userData.user.id)}
                    blockedUsers={blockedUsers}
                />
                <UserBox
                    socket={socket}
                    users={users}
                    blockedUsers={blockedUsers}
                    admins={admins}
                    owner={owner}
                    bannedUsers={bannedUsers}
                    mutedUsers={mutedUsers}
                    isDM={isDM}
                />
            </div>
        </div>
    )
}

export default Chat
