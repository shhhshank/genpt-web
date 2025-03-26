import { useState, useEffect } from 'react'
import AxiosInstance from '../api/AxiosInstance'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

const ImageToVideo = () => {
  const [images, setImages] = useState<ImageItem[]>([])
  const [videoUrl, setVideoUrl] = useState<string>()
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')
  const [minDuration, setMinDuration] = useState(15)
  const [maxDuration, setMaxDuration] = useState(30)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: ImageItem[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file)
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id)
      // Revoke the URL for the removed image
      const removedImage = prev.find(img => img.id === id)
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview)
      }
      return filtered
    })
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setImages(items)
  }

  const convertToVideo = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image')
      return
    }

    try {
      setIsConverting(true)
      setError('')
      
      const formData = new FormData()
      images.forEach(image => {
        formData.append('images', image.file)
      })
      formData.append('min_duration', minDuration.toString())
      formData.append('max_duration', maxDuration.toString())

      const response = await AxiosInstance.post('/images-to-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      })

      const videoBlob = new Blob([response.data], { type: 'video/mp4' })
      const videoObjectUrl = URL.createObjectURL(videoBlob)
      setVideoUrl(videoObjectUrl)
    } catch (ex) {
      setError('Failed to convert images to video')
    } finally {
      setIsConverting(false)
    }
  }

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview))
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [])

  return (
    <div className="content-section active">
      <h2>Convert Images to Video</h2>
      
      <div className="options-grid">
        <div className="option-item">
          <label>Minimum Duration (seconds)</label>
          <input
            type="number"
            min="5"
            max="60"
            value={minDuration}
            onChange={(e) => setMinDuration(Number(e.target.value))}
          />
        </div>
        <div className="option-item">
          <label>Maximum Duration (seconds)</label>
          <input
            type="number"
            min="5"
            max="300"
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="upload-zone">
        <h3>Upload Your Images</h3>
        <p>Drag and drop images here or click to browse</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="btn"
          disabled={isConverting}
        />
      </div>

      {images.length > 0 && (
        <div className="image-list-container">
          <h3>Arrange Images (drag to reorder)</h3>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="image-list"
                >
                  {images.map((image, index) => (
                    <Draggable key={image.id} draggableId={image.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="image-item"
                        >
                          <img src={image.preview} alt={`Upload ${index + 1}`} />
                          <button
                            className="remove-image"
                            onClick={() => removeImage(image.id)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

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
            <a className="btn" href={videoUrl} download="slideshow.mp4">
              Download Video
            </a>
          </div>
        )}
      </div>

      {images.length > 0 && !isConverting && !videoUrl && (
        <button className="btn" onClick={convertToVideo}>
          Generate Video
        </button>
      )}
    </div>
  )
}

export default ImageToVideo 