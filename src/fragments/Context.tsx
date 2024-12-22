import '../App.css'
import React, { useState } from 'react';

import {createContext} from '../api/Context'

type ContextProps = {
    active: boolean,
    setError: (error: string) => void,
    setStep: (step: number) => void,
    setShowLoader: (visible:boolean) => void;
    setContextId: (id:string) => void;
}

const Context = ({ active, setError, setStep, setShowLoader, setContextId }: ContextProps) => {

    const [file, setFile] = useState<File | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();

            // Validate file type
            if (fileExtension !== 'pdf' && fileExtension !== 'txt') {
                setError('Only PDF or TXT files are allowed.');
                return;
            }

            setFile(uploadedFile);
            setError('');
        }
    };


    const onContinue = async () => {
        setError('')
        if (!file) {
            setStep(2)
            return
        }

        setShowLoader(true)
        const id = await createContext(file)
        setContextId(id)
        setShowLoader(false)
        setStep(2)
    }

    return (
        <div className={`content-section ${active ? 'active' : ''}`} id="step2">

           
            <div className="upload-zone">
                <h3>Upload Your Context</h3>
                <p>Drag and drop your context here</p>
                <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className='btn'
                />
                
            </div>

            <button className="btn-secondary" style={{marginRight:'10px'}} onClick={() => setStep(0)}>Back</button>
            <button className="btn" onClick={onContinue}>Continue</button>
        </div>
    )
}

export default Context