import ReactDOM from 'react-dom'
import Backdrop from './Backdrop'
import Card from '../Card'
import styles from './SimpleConfirm.module.css'

interface Props {
    onConfirm: () => void
    onCancel: () => void
    title: string
    content: string
}
const ConfirmModal = (props: Props) => {
    return (
        <Card className={styles.modal}>
            <header className={styles.header}>
                <h4>{props.title}</h4>
            </header>
            <div className={styles.content}>
                <p>{props.content}</p>
            </div>
            <footer className={styles.actions}>
                <button className={styles.confirmBtn} onClick={props.onConfirm}>
                    Confirm
                </button>
                <button className={styles.cancelBtn} onClick={props.onCancel}>
                    Cancel
                </button>
            </footer>
        </Card>
    )
}

const SimpleConfirm = (props: Props) => {
    return (
        <>
            {ReactDOM.createPortal(
                <Backdrop />,
                document.getElementById('backdrop')!
            )}
            {ReactDOM.createPortal(
                <ConfirmModal
                    onConfirm={props.onConfirm}
                    onCancel={props.onCancel}
                    title={props.title}
                    content={props.content}
                />,
                document.getElementById('modal')!
            )}
        </>
    )
}

export default SimpleConfirm
