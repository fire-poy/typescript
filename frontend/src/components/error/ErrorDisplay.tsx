import styes from './ErrorDisplay.module.css'

interface ErrorDisplayProps {
    title: string
    text: string
}
const ErrorDisplay = ({ title, text }: ErrorDisplayProps) => {
    return (
        <div className={styes.content}>
            <h1>{title}</h1>
            <p>{text}</p>
        </div>
    )
}

export default ErrorDisplay
