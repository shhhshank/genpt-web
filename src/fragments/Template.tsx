import React, { useEffect, useState } from 'react';
import { createTemplate, getTemplates } from '../api/Template';
import * as TemplateTypes from '../types/Template';

type TemplateProps = {
    active: boolean,
    setError: (error: string) => void,
    setStep: (step: number) => void,
    setShowLoader: (visible: boolean) => void;
    setTemplateId: (id: string) => void;
}

const Template = ({ active, setError, setStep, setShowLoader, setTemplateId }: TemplateProps) => {

    const [template, setTemplate] = useState<string>()
    const [file, setFile] = useState<File | null>(null);

    const [templateList, setTemplateList] = useState<TemplateTypes.Template[]>([])


    const fetchTemplates = async () => {
        try {
            const templates = await getTemplates()
            setTemplateList(templates)
        } catch (ex) {
            setError(String(ex))
        }
    }

    useEffect(() => {
        if (active) {
            fetchTemplates()
        }
    }, [active])

    const onTemplateSelected = (id:string) => {
        setTemplate(id)
    }

    const onContinue = async () => {
        setError('')
        if (!file) {
            if (!template) {
                setError("Please choose a template to proceed ahead.")
                return
            }
            setTemplateId(template)
            setStep(3)
            return
        }

        try {
            setShowLoader(true)
            const result = await createTemplate(file!)
            setTemplateId(result)
            setStep(3)
        } catch (ex) {
            setError(String(ex))
        } finally {
            setShowLoader(false)
        }

    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();

            // Validate file type
            if (fileExtension !== 'ppt' && fileExtension !== 'pptx') {
                setError('Only PPT files are allowed.');
                return;
            }
            setTemplate(undefined)
            setFile(uploadedFile);
            setError('');
        }
    }

    return (
        <div className={`content-section ${active ? 'active' : ''}`} id="step2">
            <h2>Choose a Template</h2>
            <div className="template-grid">
                {templateList.filter((item:TemplateTypes.Template) => item.thumbnail != null).map((item: TemplateTypes.Template) => (
                    <div onClick={onTemplateSelected.bind(this, item.id)} className={"template-card " + (template == item.id ? "selected" : "")}>
                        <img src={"http://127.0.0.1:8080/uploads/" + item.thumbnail} alt="Modern Template" className="template-img" />
                    </div>
                ))}
            </div>

            <div className="upload-zone">
                <h3>Upload Your Template</h3>
                <p>Drag and drop your PowerPoint template here</p>
                <input
                    type="file"
                    accept=".ppt,.pptx"
                    onChange={handleFileUpload}
                    className='btn'
                />
            </div>
            <button className="btn-secondary" style={{ marginRight: '10px' }} onClick={() => setStep(1)}>Back</button>
            <button className="btn" onClick={onContinue}>Continue</button>
        </div>
    )
}

export default Template