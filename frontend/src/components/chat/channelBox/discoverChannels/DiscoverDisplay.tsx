import { Channel } from '../../../../types/Channel'
import DiscoverItem from './DiscoverItem'

interface ChannelsDisplayProps {
    channels: Channel[] | []
    joinChannel: (channelId: number, password: string) => void
}

const DiscoverDisplay = (props: ChannelsDisplayProps) => {
    let content: JSX.Element[] | JSX.Element = <p>No channels to discover!</p>
    if (props.channels !== undefined && props.channels.length > 0) {
        content = props.channels.map((channel: Channel) => (
            <DiscoverItem
                key={channel.id}
                channel={channel}
                joinChannel={props.joinChannel}
            ></DiscoverItem>
        ))
    }

    return (
        <div>
            <ul>{content}</ul>
        </div>
    )
}

export default DiscoverDisplay
