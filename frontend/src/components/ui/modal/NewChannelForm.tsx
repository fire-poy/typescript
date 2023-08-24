import ReactDOM from 'react-dom'
import { useState } from 'react'
import Backdrop from './Backdrop'
import Card from '../Card'
import styles from './NewChannelForm.module.css'
import { CreateChannel } from '../../../types/CreateChannel'
import { UserData } from '../../../types/UserData'
import { useAppSelector } from '../../../store/types'

interface Props {
    onCreate: (values: CreateChannel) => void
    onCancel: () => void
}

const Form = (props: Props) => {
    const [inputChannelValue, setInputChannelValue] = useState('')
    const [inputPasswordValue, setInputPasswordValue] = useState('')
    const [channelType, setChannelType] = useState('public')
    const [channelErrorMessage, setChannelErrorMessage] = useState('')
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const userData = useAppSelector((state) => state.user.userData) as UserData

    const handleChannelInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setInputChannelValue(event.target.value)
    }
    const handlePasswordInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setInputPasswordValue(event.target.value)
    }

    const onOk = () => {
        const isValid = checkInputValues()
        if (isValid) {
            const newChannel = {
                ownerId: userData.user.id,
                name: inputChannelValue.trim(),
                type: channelType,
                password: inputPasswordValue.trim(),
            }
            props.onCreate(newChannel)
            setInputChannelValue('')
            setInputPasswordValue('')
        }
    }

    const noLongerThanEight = () => {
        if (channelType === 'public') {
            if (inputChannelValue.trim().length > 8) {
                setChannelErrorMessage(
                    'Channel name is too long (8 characters max)'
                )
                return false
            }
            return true
        }
        if (channelType === 'private') {
            if (inputChannelValue.trim().length > 8) {
                setChannelErrorMessage(
                    'Channel name is too long (8 characters max)'
                )
                return false
            }
            setChannelErrorMessage('')
            if (inputPasswordValue.trim().length > 8) {
                setPasswordErrorMessage(
                    'Password is too long (8 characters max)'
                )
                return false
            }
        }
        return true
    }

    const inputNotEmpty = () => {
        if (channelType === 'public') {
            if (inputChannelValue.trim() === '') {
                setChannelErrorMessage('Channel name is required')
                return false
            }
            return true
        }
        if (channelType === 'private') {
            if (inputChannelValue.trim() === '') {
                setChannelErrorMessage('Channel name is required')
                return false
            }
            setChannelErrorMessage('')
            if (inputPasswordValue.trim() === '') {
                setPasswordErrorMessage('Password is required')
                return false
            }
        }
        return true
    }

    const checkInputValues = () => {
        if (inputNotEmpty() && noLongerThanEight()) {
            return true
        }
        return false
    }

    return (
        <Card className={styles.modal}>
            <header className={styles.header}>
                <h4>Create new Channel</h4>
            </header>
            <div className={styles.formControl}>
                <input
                    type="text"
                    onChange={handleChannelInputChange}
                    placeholder="Enter Channel name"
                    autoComplete="off"
                />
                {channelErrorMessage !== '' && (
                    <p className={styles.error}>{channelErrorMessage}</p>
                )}
            </div>
            <div className={styles.radioControl}>
                <input
                    type="radio"
                    value="public"
                    checked={channelType === 'public'}
                    onChange={() => setChannelType('public')}
                />
                Public
                <input
                    type="radio"
                    name="channelType"
                    value="private"
                    checked={channelType === 'private'}
                    onChange={() => setChannelType('private')}
                />
                Private
            </div>
            {channelType === 'private' && (
                <div className={styles.formControl}>
                    <input
                        type="text"
                        onChange={handlePasswordInputChange}
                        placeholder="Enter Channel password"
                        autoComplete="off"
                    />
                    {passwordErrorMessage !== '' && (
                        <p className={styles.error}>{passwordErrorMessage}</p>
                    )}
                </div>
            )}
            <div className={styles.formActions}>
                <button className={styles.confirmBtn} onClick={onOk}>
                    Create
                </button>
                <button className={styles.cancelBtn} onClick={props.onCancel}>
                    Cancel
                </button>
            </div>
        </Card>
    )
}

const NewChannelForm = (props: Props) => {
    return (
        <>
            {ReactDOM.createPortal(
                <Backdrop />,
                document.getElementById('backdrop')!
            )}
            {ReactDOM.createPortal(
                <Form onCreate={props.onCreate} onCancel={props.onCancel} />,
                document.getElementById('modal')!
            )}
        </>
    )
}

export default NewChannelForm
