import { useState } from 'react'
import styles from '../ChannelLi.module.css'
import { Channel } from '../../../../types/Channel'
import IconPrivate from '../../../../assets/icon/lock.svg'
import ChannelType from '../../../../types/ChannelType'
import { useAppSelector } from '../../../../store/types'
import SimpleConfirm from '../../../ui/modal/SimpleConfirm'
import SimpleInput from '../../../ui/modal/SimpleInput'

interface DiscoverItemProps {
    channel: Channel
    joinChannel: (channelId: number, password: string) => void
}

const DiscoverItem = (props: DiscoverItemProps) => {
    const [open, setOpen] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const currentChatSelected = useAppSelector(
        (state) => state.chat.currentChatSelected
    ) as number

    const showModal = () => {
        if (props.channel.type === ChannelType.Private) {
            setShowInput(true)
        }
        setOpen(true)
    }

    const handleJoiningDemand = (password: string) => {
        setOpen(false)
        setShowInput(false)
        setTimeout(() => {
            props.joinChannel(props.channel.id, password)
        }, 300)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const handleEnteredPassword = (password: string) => {
        handleJoiningDemand(password)
    }

    const handleNoPassword = () => {
        handleJoiningDemand('')
    }

    let title = `Do you want to join ${props.channel.name}??`
    let content = ''
    if (showInput) {
        content = 'Please, enter the Password'
    }

    let isActive = props.channel.id === currentChatSelected ? styles.active : ''

    return (
        <>
            <li className={`${styles.li} ${isActive}`} onClick={showModal}>
                <div className={styles.text}>{props.channel.name}</div>
                <div className={styles.iconsContainer}>
                    {props.channel.type === ChannelType.Private ? (
                        <img
                            src={IconPrivate}
                            alt="Private Channel"
                            className={styles.privateIcon}
                        />
                    ) : null}
                </div>
            </li>
            {open && !showInput && (
                <SimpleConfirm
                    onConfirm={handleNoPassword}
                    onCancel={handleCancel}
                    title={title}
                    content={content}
                />
            )}
            {open && showInput && (
                <SimpleInput
                    onConfirm={handleEnteredPassword}
                    onCancel={handleCancel}
                    title={title}
                    content={content}
                    name="Password"
                />
            )}
        </>
    )
}

export default DiscoverItem
