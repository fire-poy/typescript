import { Channel } from '../../../../types/Channel'
import JoinedItem from './JoinedItem'

interface ChannelsDisplayProps {
    channels: Channel[] | []
    deleteChannel: (channelId: number) => void
    leaveChannel: (channelId: number) => void
    changePassword: (channelId: number, password: string) => void
}

const JoinedDisplay = (props: ChannelsDisplayProps) => {
    let content: JSX.Element[] | JSX.Element = (
        <p>Join a Channel to start chating!</p>
    )
    if (props.channels !== undefined && props.channels.length > 0) {
        content = props.channels.map((channel: Channel) => (
            <JoinedItem
                key={channel.id}
                channel={channel}
                deleteChannel={props.deleteChannel}
                leaveChannel={props.leaveChannel}
                changePassword={props.changePassword}
            ></JoinedItem>
        ))
    }

    return (
        <div>
            <ul>{content}</ul>
        </div>
    )
}

export default JoinedDisplay
