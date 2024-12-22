import React, { useState } from 'react';

type OptionProps = {
    active: boolean,
    setError: (error: string) => void,
    setStep: (step: number) => void,
    setOption:(option:OptionItem) => void
}

export type OptionItem = {
    slideCount:number,
    pointCount:number,
    contentSize:string
}

const CONTENT_CATEGORIES = [
    "Concise",
    "Moderate",
    "Comprehensive",
    "Extensive"
]

const Option = ({ active, setError, setStep, setOption }: OptionProps) => {

    const [slideCount, setSlideCount] = useState<string>("3")
    const [pointCount, setPointCount] = useState<string>("5")
    const [contentSize, setContentSize] = useState<string>("Moderate")


    const onFinish = () => {
        setError("")
        if(!isValidCount(slideCount, 3, 10)){
            setError("Please give valid slide counts [max=10, min=3]")
            return
        }

        if(!isValidCount(pointCount, 3, 8)){
            setError("Please give valid point counts [max=8, min=3]")
            return
        }

        if(!contentSize || contentSize === ""){
            setError("Please choose a valid content size")
            return
        }
        
        setOption({
            slideCount:Number(slideCount),
            pointCount:Number(pointCount),
            contentSize
        })

        setStep(4)
        
    }

    const isValidCount = (num:string, min:number, max:number) => {
        if(!slideCount || slideCount === ""){
            return false
        }

        let no = Number(num)

        if(isNaN(no)){
            return false
        }
        
        if(no < min || no > max){
            return false
        }

        return true

    }

    const onContentSizeChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setContentSize(event.target.value)
    }       

    return (
        <div className={`content-section ${active ? 'active' : ''}`} id="step3">
            <h2>Presentation Options</h2>
            <div className="options-grid">
                <div className="option-item">
                    <label>Number of Slides</label>
                    <input onChange={e => setSlideCount(e.target.value)} type="number" min="3" max="10" value={slideCount}/>
                </div>
                <div className="option-item">
                    <label>Points per Slide</label>
                    <input onChange={e => setPointCount(e.target.value)} type="number" min="3" max="8" value={pointCount} />
                </div>
                <div className="option-item">
                    <label>Content Size</label>
                    <select value={contentSize} onChange={onContentSizeChange}>
                        {CONTENT_CATEGORIES.map((item:string) => (
                            <option value={item} selected={item === contentSize}>{item}</option>
                        ))}
                    </select>
                </div>
            </div>
            <button className="btn-secondary" style={{marginRight:'10px'}} onClick={() => setStep(2)}>Back</button>
            <button className="btn" onClick={onFinish}>Finish</button>
        </div>
    )
}

export default Option