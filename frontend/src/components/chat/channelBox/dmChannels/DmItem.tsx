import { useState } from 'react'
import styles from '../ChannelLi.module.css'
import { Channel } from '../../../../types/Channel'
import IconLeaveChannel from '../../../../assets/icon/block_user.svg'
import { useAppSelector, useAppDispatch } from '../../../../store/types'
import { UserData } from '../../../../types/UserData'
import { chatActions } from '../../../../store/chat'
import SimpleConfirm from '../../../ui/modal/SimpleConfirm'

interface DmItemProps {
    channel: Channel
    deleteChannel: (channelId: number) => void
    leaveChannel: (channelId: number) => void
}

const DmItem = (props: DmItemProps) => {
    const userData = useAppSelector((state) => state.user.userData) as UserData
    const currentChatSelected = useAppSelector(
        (state) => state.chat.currentChatSelected
    ) as number
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(false)
    const [isOwner, setIsOwner] = useState(false)

    const handleClick = () => {
        dispatch(
            chatActions.updateChat({
                currentChatSelected: props.channel.id,
                type: props.channel.type,
            })
        )
    }

    const handleOk = () => {
        setOpen(false)
        setIsOwner(false)
        setTimeout(() => {
            if (isOwner) {
                props.deleteChannel(props.channel.id)
            } else {
                props.leaveChannel(props.channel.id)
            }
        }, 300)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const showModal = () => {
        if (props.channel.owner.id === userData.user.id) {
            setIsOwner(true)
        }
        setOpen(true)
    }

    let title = `Are you sure you want to leave ${props.channel.name}?`
    let content = ''
    if (isOwner) {
        content = `If you leave, the channel will be deleted. Continue?`
    }

    let isActive = props.channel.id === currentChatSelected ? styles.active : ''

    return (
        <>
            <li className={`${styles.li} ${isActive}`} onClick={handleClick}>
                <div className={styles.text}>{props.channel.name}</div>
                <div className={styles.iconsContainer}>
                    {
                        <img
                            src={IconLeaveChannel}
                            alt="LeaveChannel"
                            className={styles.addChannelIcon}
                            onClick={showModal}
                        />
                    }
                </div>
            </li>
            {open && (
                <SimpleConfirm
                    onConfirm={handleOk}
                    onCancel={handleCancel}
                    title={title}
                    content={content}
                />
            )}
        </>
    )
}

export default DmItem
