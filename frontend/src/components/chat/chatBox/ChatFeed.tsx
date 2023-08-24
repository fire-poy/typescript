import { useEffect, useRef } from 'react'
import Msg from './Msg'
import styles from './ChatFeed.module.css'
import { ReceivedMsg } from '../../../pages/Chat'

interface ChatFeedProps {
    messages: ReceivedMsg[]
    blockedUsers: number[]
}

const ChatFeed = ({ messages, blockedUsers }: ChatFeedProps) => {
    const isFeedFull = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isFeedFull.current)
            isFeedFull.current.scrollTop = isFeedFull.current?.scrollHeight
    }, [messages])

    return (
        <div className={styles.container} ref={isFeedFull}>
            {messages.map((msg) => (
                <Msg key={msg.id} msg={msg} blockedUsers={blockedUsers}></Msg>
            ))}
        </div>
    )
}

export default ChatFeed
