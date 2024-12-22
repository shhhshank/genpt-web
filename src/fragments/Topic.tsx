import React, { useState } from 'react';
import '../App.css'

type TopicProps = {
    active: boolean,
    setError: (error: string) => void,
    setStep: (step: number) => void,
    onTopicSet:(topic:string) => void
}

const Topic = ({ active, setError, setStep, onTopicSet }: TopicProps) => {

    const [topic, setTopic] = useState<string>()

    const onGenerate = () => {
        setError('')
        if (!topic || topic === '') {
            setError("Please enter a topic to proceed ahead.")
            return
        }
        
        onTopicSet(topic)
        setStep(1)
    }

    return (
        <div className={`content-section ${active ? 'active' : ''}`} id="step1">
            <div className="prompt-section">
                <div className="info-box">
                    <h3>How it works</h3>
                    <p>GenPT uses advanced AI to create professional presentations from your topic. Simply enter your topic below and let our system do the work!</p>
                </div>
                <textarea onChange={e => setTopic(e.target.value)} className="prompt-input" value={topic} placeholder="Enter your presentation topic here..." rows={4}></textarea>
                <button className="btn" onClick={onGenerate}>Generate Content</button>
            </div>
        </div>
    )
}

export default Topic