import { useEffect, useState } from 'react';
import { Payload } from '../api/Generator';
import AxiosInstance from '../api/AxiosInstance';

type FinalProps = {
    active: boolean,
    setError: (error: string) => void,
    setStep: (step: number) => void,
    parameters: Payload
}

const Final = ({ active, parameters, setError, setStep }: FinalProps) => {

    const [downloadUrl, setDownloadUrl] = useState<string>()
    const [pptBlob, setPptBlob] = useState<Blob>()
    const [videoUrl, setVideoUrl] = useState<string>()
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)

    const generate = async () => {
        try {
            const response = await AxiosInstance.post('/generate', parameters, {
                responseType: 'blob'
            });
            
            // Create blob and store it
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
            });
            setPptBlob(blob)
            setDownloadUrl(URL.createObjectURL(blob))
        } catch (ex) {
            setError(String(ex))
        }
    }

    const generateVideo = async () => {
        if (!pptBlob) {
            setError('PPT file not found')
            return
        }

        try {
            setIsGeneratingVideo(true)
            const formData = new FormData()
            formData.append('ppt_file', pptBlob, 'presentation.pptx')

            const response = await AxiosInstance.post('/convert-ppt-to-video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob'
            })

            const videoBlob = new Blob([response.data], { type: 'video/mp4' })
            const videoObjectUrl = URL.createObjectURL(videoBlob)
            setVideoUrl(videoObjectUrl)
        } catch (ex) {
            setError(String(ex))
        } finally {
            setIsGeneratingVideo(false)
        }
    }

    useEffect(() => {
        if (active) {
            generate()
        }
    }, [active])

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl)
            }
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl)
            }
        }
    }, [downloadUrl, videoUrl])

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
                    <div className="download-options">
                        <a className="btn" href={downloadUrl}>Download PPT</a>
                        {!videoUrl ? (
                            <button 
                                className="btn" 
                                onClick={generateVideo}
                                disabled={isGeneratingVideo}
                            >
                                {isGeneratingVideo ? 'Generating Video...' : 'Generate Video'}
                            </button>
                        ) : (
                            <a className="btn" href={videoUrl}>Download Video</a>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Final