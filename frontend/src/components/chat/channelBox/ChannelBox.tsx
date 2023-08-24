import styles from './ChannelBox.module.css'
import CreateNewCh from './CreateNewCh'
import ChannelList from './ChannelList'
import { Channel } from '../../../types/Channel'
import { Socket } from 'socket.io-client'

interface ChannelBoxProps {
    allChan: Channel[]
    socket: Socket | undefined
}

const ChannelBox = (props: ChannelBoxProps) => {
    return (
        <div className={styles.channelbox}>
            <CreateNewCh socket={props.socket} />
            <ChannelList
                allChan={props.allChan}
                socket={props.socket}
            ></ChannelList>
        </div>
    )
}

export default ChannelBox
