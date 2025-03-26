import { useState, useEffect } from 'react'
import AxiosInstance from '../api/AxiosInstance'

const PPTToVideo = () => {
  const [file, setFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>()
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')

  const handlePPTUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      const fileExt = uploadedFile.name.split('.').pop()?.toLowerCase()
      if (fileExt !== 'ppt' && fileExt !== 'pptx') {
        setError('Please upload a valid PowerPoint file')
        return
      }
      setFile(uploadedFile)
      setError('')
      await convertToVideo(uploadedFile)
    }
  }

  const convertToVideo = async (pptFile: File) => {
    try {
      setIsConverting(true)
      const formData = new FormData()
      formData.append('ppt_file', pptFile)

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
      setError('Failed to convert PPT to video')
    } finally {
      setIsConverting(false)
    }
  }

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  return (
    <div className="content-section active">
      <h2>Convert PPT to Video</h2>
      <div className="upload-zone">
        <h3>Upload Your PowerPoint</h3>
        <p>Drag and drop your PPT file here</p>
        <input
          type="file"
          accept=".ppt,.pptx"
          onChange={handlePPTUpload}
          className="btn"
          disabled={isConverting}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="conversion-status">
        {isConverting ? (
          <div className="processing">
            <div className="spinner"></div>
            <h3>Converting to Video</h3>
            <p>This may take a few minutes...</p>
          </div>
        ) : videoUrl && (
          <div className="download-options">
            <h3>Conversion Complete!</h3>
            <a className="btn" href={videoUrl} download="presentation.mp4">
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default PPTToVideo 