import styles from './UserInformation.module.css'
import ClickableIcon from './ClickableIcon'
import IconEditProfile from '../../assets/icon/edit_profile.svg'
import switchButtonStyles from './SwitchButton.module.css'
import { useState, useEffect } from 'react'
import { useAppSelector } from '../../store/types'
import { UserData } from '../../types/UserData'
import SimpleInput from '../ui/modal/SimpleInput'
import { userActions } from '../../store/user'
import { useDispatch } from 'react-redux'

const UserInformation = () => {
    const userData = useAppSelector((state) => state.user.userData) as UserData
    const [TFAEnabled, setTFAEnabled] = useState(userData.user.TFAEnabled)
    const [openModal, setOpenModal] = useState(false)
    const [shouldReloadUserData, setShouldReloadUserData] = useState(false)
    const dispatch = useDispatch()

    const reloadUser = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/me`, {
                method: 'GET',
                credentials: 'include',
            })

            if (response.status !== 200) {
                throw new Response(
                    JSON.stringify({ message: 'Error fetching user data' }),
                    { status: 400 }
                )
            }

            const data = await response.json()
            dispatch(userActions.update({ user: data }))
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    useEffect(() => {
        if (shouldReloadUserData) {
            reloadUser()
            setTimeout(() => {
                setShouldReloadUserData(false)
            }, 300)
        }
    }, [shouldReloadUserData, userData])

    const editProfileNickname = async (newNickname: string) => {
        try {
            const response = await fetch(
                'http://localhost:8080/api/user/updatenickname',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ nickname: newNickname }),
                }
            )
            if (response.ok) {
                const data = await response.json()
                if (data?.error) alert(data.error)
                reloadUser()
            } else {
                console.error('Failed to update nickname')
            }
        } catch (error) {
            console.error('Error updating nickname:', error)
        }
    }

    const handleToggleSwitch = async () => {
        if (TFAEnabled) {
            try {
                const response = await fetch(
                    'http://localhost:8080/api/auth/2fa/turn-off',
                    {
                        method: 'POST',
                        credentials: 'include',
                    }
                )
                if (response.ok) {
                    setTFAEnabled(false)
                }
            } catch (error) {
                console.error('Error turning off 2FA:', error)
            }
        } else {
            window.location.href = 'http://localhost:4040/TFATurnOn'
        }
    }

    const handleEnteredName = (newName: string) => {
        editProfileNickname(newName)
        setOpenModal(false)
        setShouldReloadUserData(true)
    }

    const handleCancel = () => {
        setOpenModal(false)
    }

    const editProfilePicture = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                const formData = new FormData()
                formData.append('profilePicture', file)

                const response = await fetch(
                    'http://localhost:8080/api/user/upload-profile-picture',
                    {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                    }
                )

                if (response.status === 201) {
                    setShouldReloadUserData(true)
                } else {
                    console.error(
                        'Error loading profile image:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error loading profile image:', error)
            }
        }
    }

    const userLevel = Math.floor(userData.user.xp / 100 + 1)

    return (
        <div className={styles.container}>
            {openModal && (
                <SimpleInput
                    onConfirm={handleEnteredName}
                    onCancel={handleCancel}
                    title={'Enter your new nickname'}
                    content={''}
                    name="New nickname"
                />
            )}
            <label
                htmlFor="profile-picture"
                className={styles.profilePicture}
                style={{
                    backgroundImage: `url(${userData.user.avatarUrl})`,
                }}
            >
                <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={editProfilePicture}
                    style={{ display: 'none' }}
                />
            </label>
            <div>
                <ul className={styles.verticalList}>
                    <li>
                        {userData.user.nickname}
                        <ClickableIcon
                            icon={IconEditProfile}
                            onClick={() => setOpenModal(true)}
                        />
                    </li>
                    <li>Level {userLevel}</li>
                    <li>
                        2fa is
                        {TFAEnabled ? ' activated ' : ' deactivated '}
                        <label className={switchButtonStyles.switch}>
                            <input
                                type="checkbox"
                                checked={TFAEnabled}
                                readOnly
                            />
                            <span
                                className={switchButtonStyles.slider}
                                onClick={handleToggleSwitch}
                            ></span>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default UserInformation
