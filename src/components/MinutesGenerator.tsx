import { useState } from 'react';
import AxiosInstance from '../api/AxiosInstance';

const MinutesGenerator = () => {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState('docx');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string>();
    const [error, setError] = useState('');

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            const fileExt = uploadedFile.name.split('.').pop()?.toLowerCase();
            if (fileExt !== 'ppt' && fileExt !== 'pptx') {
                setError('Please upload a valid PowerPoint file');
                return;
            }
            setFile(uploadedFile);
            setError('');
        }
    };

    const generateMinutes = async () => {
        if (!file) {
            setError('Please upload a presentation first');
            return;
        }
    
        try {
            setIsGenerating(true);
            const formData = new FormData();
            // Change to match backend expectation of 'presentation'
            formData.append('presentation', file);
            formData.append('format', format);
            if (prompt) {
                formData.append('prompt', prompt);
            }
    
            const response = await AxiosInstance.post('/generate-minutes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'  // Add this header
                },
                responseType: 'blob'
            });
    
            // Update content type based on backend response format (docx or pdf)
            const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-document.wordprocessing';
            const blob = new Blob([response.data], { type: contentType });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (ex) {
            setError('Failed to generate minutes');
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <div className="content-section active">
            <h2>Generate Meeting Minutes</h2>
            <div className="upload-zone">
                <h3>Upload Your PowerPoint</h3>
                <input
                    type="file"
                    accept=".ppt,.pptx"
                    onChange={handleFileUpload}
                    className="btn"
                    disabled={isGenerating}
                />
            </div>

            <div className="options-grid">
            <div className="option-item">
                <label>Output Format</label>
                <select 
                    value={format} 
                    onChange={(e) => setFormat(e.target.value)}
                    disabled={isGenerating}
                >
                    <option value="docx">Word Document</option>
                    <option value="pdf">PDF</option>
                </select>
            </div>
                
                <div className="option-item">
                    <label>Custom Instructions (Optional)</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g., Focus on action items and include a timeline for each task"
                        disabled={isGenerating}
                    />
                </div>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="action-section">
                {!downloadUrl ? (
                    <button 
                        className="btn" 
                        onClick={generateMinutes}
                        disabled={isGenerating || !file}
                    >
                        {isGenerating ? 'Generating Minutes...' : 'Generate Minutes'}
                    </button>
                ) : (
                    <div className="download-options">
                        <h3>Minutes Generated!</h3>
                        <a 
                            className="btn" 
                            href={downloadUrl} 
                            download={`meeting_minutes.${format}`}  // Match the backend format
                        >
                            Download Minutes
                        </a>
                        <button 
                            className="btn secondary" 
                            onClick={() => {
                                URL.revokeObjectURL(downloadUrl);
                                setDownloadUrl(undefined);
                                setFile(null);
                            }}
                        >
                            Generate Another
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MinutesGenerator; 