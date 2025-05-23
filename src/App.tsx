import { useState } from 'react'
import Topic from './fragments/Topic'
import Template from './fragments/Template'
import Option, { OptionItem } from './fragments/Option'
import Final from './fragments/Final'
import Context from './fragments/Context'
import FullScreenLoader from './components/FullScreenLoader'
import PPTToVideo from './components/PPTToVideo'
import ImageToVideo from './components/ImageToVideo'
import MinutesGenerator from './components/MinutesGenerator'


function App() {
  const [mode, setMode] = useState< 'minutes' | 'landing' | 'textToPPT' | 'pptToVideo' | 'imageToVideo'>('landing')
  const [step, setStep] = useState(0)
  const [topic, setTopic] = useState<string>()
  
  const [downloadUrl, setDownloadUrl] = useState()

  const [error, setError] = useState<string>()
  const [showLoader, setShowLoader] = useState<boolean>(false)

  const [contextId, setContextId] = useState<string>()
  const [templateId, setTemplateId] = useState<string>()
  const [option, setOption] = useState<OptionItem>()
  const [canHaveImage, setCanHaveImage] = useState<boolean>(false)

  const resetAndGoToLanding = () => {
    setMode('landing')
    setStep(0)
    // Reset other states as needed
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo" onClick={resetAndGoToLanding} style={{ cursor: 'pointer' }}>GenPT</div>
        <p>Transform your ideas into professional presentations with AI</p>
      </div>

      {mode === 'landing' ? (
        <div className="mode-selection">
          <div className="mode-card" onClick={() => setMode('textToPPT')}>
            <h2>Text to PPT</h2>
            <p>Generate professional presentations from your text input</p>
            <button className="btn">Get Started</button>
          </div>

          <div className="mode-card" onClick={() => setMode('pptToVideo')}>
            <h2>PPT to Video</h2>
            <p>Convert your PowerPoint presentations into engaging videos</p>
            <button className="btn">Convert Now</button>
          </div>

          <div className="mode-card" onClick={() => setMode('imageToVideo')}>
            <h2>Image to Video</h2>
            <p>Transform your images into dynamic video presentations</p>
            <button className="btn">Try It Out</button>
          </div>

          {/* <div className="mode-card" onClick={() => setMode('minutes')}>
            <h2>Generate Minutes</h2>
            <p>Create meeting minutes from your presentations automatically</p>
            <button className="btn">Generate Minutes</button>
          </div> */}

        </div>


      ) : mode === 'minutes' ? (
        <MinutesGenerator />
      ) : mode === 'textToPPT' ? (
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

          <Topic active={step == 0} setError={setError} setStep={setStep} onTopicSet={setTopic}/>
          <Context active={step == 1} setError={setError} setStep={setStep} setShowLoader={setShowLoader} setContextId={setContextId}/>
          <Template active={step == 2} setError={setError} setStep={setStep} setShowLoader={setShowLoader} setTemplateId={setTemplateId} setCanHaveImage={setCanHaveImage}/>
          <Option active={step == 3} setError={setError} setStep={setStep} setOption={setOption} canHaveImage={canHaveImage}/>
          <Final active={step == 4} setError={setError} setStep={setStep} parameters={{
            topic:topic!,
            contextId:contextId!,
            templateId:templateId!,
            options:option!
          }}/>
          
          <p className='error'>{error}</p>
          
        </div>
      ) : mode === 'pptToVideo' ? (
        <PPTToVideo />
      ) : mode === 'imageToVideo' ? (
        <ImageToVideo />
      ) : null}

      <FullScreenLoader isVisible={showLoader}/>
    </div>
  )
}

export default App
