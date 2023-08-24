import styles from './SendForm.module.css'
import { useState, ChangeEvent, KeyboardEvent } from 'react'
import { useAppSelector } from '../../../store/types'
import { UserData } from '../../../types/UserData'
import { NewMsg } from '../../../pages/Chat'

interface ChatFeedProps {
    sendMessage: (NewMsg: NewMsg) => void
    amImuted: boolean
}

const SendForm = ({ sendMessage }: ChatFeedProps) => {
    const userData = useAppSelector((state) => state.user.userData) as UserData
    const currentChatSelected = useAppSelector(
        (state) => state.chat.currentChatSelected
    ) as number
    const [inputText, setInputText] = useState('')

    const handleCreation = (text: string) => {
        const newMsg = {
            creator: userData.user.id,
            content: text,
            channelId: currentChatSelected,
        }
        sendMessage(newMsg)
        setInputText('')
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleCreation(inputText)
        }
    }

    return (
        <div className={styles.textInputWrapper}>
            <input
                className={styles.textInput}
                placeholder="Send message"
                type="text"
                value={inputText}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                id="message-input"
                autoComplete="off"
            />
        </div>
    )
}

export default SendForm
