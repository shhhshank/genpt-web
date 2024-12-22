import React, { useEffect, useState } from 'react';
import { generatePPT, Payload } from '../api/Generator';

type FinalProps = {
    active: boolean,
    setError: (error: string) => void,
    setStep: (step: number) => void,
    parameters: Payload
}

const Final = ({ active, parameters, setError, setStep }: FinalProps) => {

    const [downloadUrl, setDownloadUrl] = useState<string>()

    const generate = async () => {
        try {
            const url = await generatePPT(parameters)
            setDownloadUrl(url)
        } catch (ex) {
            setError(String(ex))
        }
    }

    useEffect(() => {
        if (active) {
            generate()
        }
    }, [active])

    return (
        <div className={`content-section ${active ? 'active' : ''}`} id="step4">
            <div className="processing">
                {!downloadUrl ? (
                    <>
                        <div className="spinner"></div>
                        <h2>Generating Your Presentation</h2>
                        <p>This may take a few minutes...</p>
                    </>
                ) : (
                    <a className="btn" href={downloadUrl}>Download</a>
                )
                }


            </div>
        </div>
    )
}

export default Final