import Navbar from '../navigation/Navbar'
import styles from './Error.module.css'
import ErrorDisplay from './ErrorDisplay'
import { useRouteError } from 'react-router-dom'

interface Error {
    status: number
    statusText: string
    internal: boolean
    data: string
}

const ErrorPage = () => {
    let title = '404'
    let text = "This page doesn't exist."

    const error = useRouteError() as Error
    if (error.status === 400) {
        text = JSON.parse(error.data).message
        title = '400'
    }
    return (
        <>
            <Navbar></Navbar>
            <div className={styles.container}>
                <ErrorDisplay title={title} text={text}></ErrorDisplay>
            </div>
        </>
    )
}

export default ErrorPage
