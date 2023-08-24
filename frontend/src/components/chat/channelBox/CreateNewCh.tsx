import { useState } from 'react'
import IconAddChannel from '../../../assets/icon/add_friend.svg'
import styles from './CreateNewCh.module.css'
import { CreateChannel } from '../../../types/CreateChannel'
import NewChannelForm from '../../ui/modal/NewChannelForm'
import { Socket } from 'socket.io-client'
import { useAppDispatch } from '../../../store/types'
import { chatActions } from '../../../store/chat'

interface CreateNewChProps {
    socket: Socket | undefined
}

const CreateNewCh = ({ socket }: CreateNewChProps) => {
    const [open, setOpen] = useState(false)
    const dispatch = useAppDispatch()

    const onCreate = (values: CreateChannel) => {
        setOpen(false)
        createNewChannel(values)
    }

    const createNewChannel = (channel: CreateChannel) => {
        if (socket !== undefined) {
            socket.emit('createNewChannel', channel, (response: any) => {
                dispatch(
                    chatActions.updateChat({
                        currentChatSelected: response.id,
                        type: channel.type,
                    })
                )
                if (response?.error) {
                    alert(response.error)
                }
            })
        }
    }

    return (
        <>
            <div className={styles.channelBox}>
                <button
                    className={styles.btn}
                    onClick={() => {
                        setOpen(true)
                    }}
                >
                    New channel
                    <img
                        src={IconAddChannel}
                        alt="plus sign"
                        className={styles.addChannelIcon}
                    />
                </button>
            </div>
            {open && (
                <NewChannelForm
                    onCreate={onCreate}
                    onCancel={() => setOpen(false)}
                />
            )}
        </>
    )
}

export default CreateNewCh
