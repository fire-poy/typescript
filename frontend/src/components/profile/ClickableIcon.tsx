import styles from './ClickableIcon.module.css'

export interface ClickableIconProps {
    icon: string
    onClick?: () => void
    children?: React.ReactNode
}

const ClickableIcon = ({
    icon,
    onClick,
    children,
}: React.PropsWithChildren<ClickableIconProps>) => {
    const handleIconClick = () => {
        if (onClick) {
            onClick()
        }
    }

    return (
        <span className={styles.btn} onClick={handleIconClick}>
            <img src={icon} alt="Icon" />
            {children}
        </span>
    )
}

export default ClickableIcon
