import { useState } from 'react'
import styles from '../ChannelLi.module.css'
import { Channel } from '../../../../types/Channel'
import IconLeaveChannel from '../../../../assets/icon/block_user.svg'
import IconPrivate from '../../../../assets/icon/lock.svg'
import ChannelType from '../../../../types/ChannelType'
import { useAppDispatch, useAppSelector } from '../../../../store/types'
import { UserData } from '../../../../types/UserData'
import { chatActions } from '../../../../store/chat'
import SimpleConfirm from '../../../ui/modal/SimpleConfirm'
import SimpleInput from '../../../ui/modal/SimpleInput'

interface JoinedItemProps {
    channel: Channel
    deleteChannel: (channelId: number) => void
    leaveChannel: (channelId: number) => void
    changePassword: (channelId: number, password: string) => void
}

const JoinedItem = (props: JoinedItemProps) => {
    const userData = useAppSelector((state) => state.user.userData) as UserData
    const currentChatSelected = useAppSelector(
        (state) => state.chat.currentChatSelected
    ) as number
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [canChangePassword, setCanChangePassword] = useState(false)

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

    const handleChangePassword = (newPassword: string) => {
        props.changePassword(props.channel.id, newPassword)
        setCanChangePassword(false)
        setOpen(false)
    }

    const handleCancel = () => {
        setOpen(false)
        setCanChangePassword(false)
        setIsOwner(false)
    }

    const showConfirmModal = () => {
        if (props.channel.owner.id === userData.user.id) {
            setIsOwner(true)
        }
        setOpen(true)
    }

    const showChangePasswordModal = () => {
        if (props.channel.owner.id === userData.user.id) {
            setCanChangePassword(true)
            setOpen(true)
        }
    }

    let title = `Are you sure you want to leave ${props.channel.name}?`
    let content = ''
    if (isOwner) {
        content = `If you leave, the channel will be deleted. Continue?`
    }
    if (canChangePassword) {
        title = 'Please, enter a new Password'
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
                            onClick={showConfirmModal}
                        />
                    }
                    {props.channel.type === ChannelType.Private ? (
                        <img
                            src={IconPrivate}
                            alt="Private Channel"
                            className={styles.privateIcon}
                            onClick={showChangePasswordModal}
                        />
                    ) : null}
                </div>
            </li>
            {open && !canChangePassword && (
                <SimpleConfirm
                    onConfirm={handleOk}
                    onCancel={handleCancel}
                    title={title}
                    content={content}
                />
            )}
            {open && canChangePassword && (
                <SimpleInput
                    onConfirm={handleChangePassword}
                    onCancel={handleCancel}
                    title={title}
                    content={content}
                    name="Password"
                />
            )}
        </>
    )
}

export default JoinedItem
