import { useEffect, useState } from 'react'

const CodeQR = () => {
    const [loading, setLoading] = useState(true)
    const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/auth/2fa/generate`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                )
                if (!response.ok) {
                    throw new Error('Failed to fetch QR code')
                }
                const data = await response.text()
                setQrCodeDataURL(data)
                setLoading(false)
            } catch (error) {
                console.error('Error obtaining the QR code:', error)
            }
        }

        fetchQRCode()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h4>Scan me to activate 2fa</h4>
            {qrCodeDataURL && <img src={qrCodeDataURL} alt="QR Code" />}
        </div>
    )
}

export default CodeQR
