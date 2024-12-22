import { useState } from 'react'
import Topic from './fragments/Topic'
import Template from './fragments/Template'
import Option, { OptionItem } from './fragments/Option'
import Final from './fragments/Final'
import Context from './fragments/Context'
import FullScreenLoader from './components/FullScreenLoader'



function App() {
  const [step, setStep] = useState(0)
  const [topic, setTopic] = useState<string>()
  
  const [downloadUrl, setDownloadUrl] = useState()

  const [error, setError] = useState<string>()
  const [showLoader, setShowLoader] = useState<boolean>(false)

  const [contextId, setContextId] = useState<string>()
  const [templateId, setTemplateId] = useState<string>()
  const [option, setOption] = useState<OptionItem>()

  return (
    <div className="container">
      <div className="header">
        <div className="logo">GenPT</div>
        <p>Transform your ideas into professional presentations with AI</p>
      </div>

      <div className="step-container">
        <div className="step-indicator">
          <div className={`step ${step == 0 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-title">Enter Topic</div>
          </div>
          <div className={`step ${step == 1 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-title">Give Context</div>
          </div>
          <div className={`step ${step == 2 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-title">Choose Template</div>
          </div>
          <div className={`step ${step == 3 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-title">Set Options</div>
          </div>
          <div className={`step ${step == 4 ? 'active' : ''}`}>
            <div className="step-number">5</div>
            <div className="step-title">Download</div>
          </div>
        </div>

        <Topic active={step == 0} setError={setError} setStep={setStep} onTopicSet={(topic:string) => {setTopic(topic)}}/>
        <Context active={step == 1} setError={setError} setStep={setStep} setShowLoader={setShowLoader} setContextId={setContextId}/>
        <Template active={step == 2} setError={setError} setStep={setStep} setShowLoader={setShowLoader} setTemplateId={setTemplateId}/>
        <Option active={step == 3} setError={setError} setStep={setStep} setOption={setOption}/>
        <Final parameters={{
          topic:topic!,
          contextId:contextId!,
          templateId:templateId!,
          options:option!
        }} active={step == 4}  setError={setError} setStep={setStep}/>
        
        <p className='error'>{error}</p>
        
      </div>

      <FullScreenLoader isVisible={showLoader}/>
    </div>
  )
}

export default App
