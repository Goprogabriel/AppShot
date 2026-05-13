import { useState } from 'react'
import { EditorPage } from './pages/EditorPage'
import { LandingPage } from './pages/LandingPage'
import { SetupPage } from './pages/SetupPage'
import { PROJECT_STORAGE_KEY, useScreenshotProject } from './hooks/useScreenshotProject'
import type { DeviceType } from './types/device'

type Step = 'landing' | 'setup' | 'editor'

function App() {
  const [step, setStep] = useState<Step>(() => (localStorage.getItem(PROJECT_STORAGE_KEY) ? 'editor' : 'landing'))
  const [setupDevice, setSetupDevice] = useState<DeviceType>('iphone')
  const [count, setCount] = useState(5)
  const {
    project,
    selectedSlide,
    selectedResolvedSlide,
    startProject,
    resetProject,
    updateProject,
    updateSelectedSlide,
    addSlide,
    removeSlide,
    moveSlide,
    applyToAll,
    updateGlobalStyle,
    updateGlobalTextStyle,
    updateGlobalDeviceStyle,
    applyGlobalToAll,
    resetSelectedBackgroundToGlobal,
    resetSelectedDeviceToGlobal,
    setExportSize,
    canAddMore,
  } = useScreenshotProject()

  function chooseDevice(deviceType: DeviceType) {
    setSetupDevice(deviceType)
    setStep('setup')
  }

  function createAndOpenEditor() {
    startProject(setupDevice, count)
    setStep('editor')
  }

  if (step === 'setup') {
    return <SetupPage deviceType={setupDevice} count={count} onCountChange={setCount} onBack={() => setStep('landing')} onCreate={createAndOpenEditor} />
  }

  if (step === 'editor' && project && selectedSlide && selectedResolvedSlide) {
    return (
      <EditorPage
        project={project}
        selectedSlide={selectedSlide}
        selectedResolvedSlide={selectedResolvedSlide}
        canAddMore={canAddMore}
        onBackToLanding={() => setStep('landing')}
        onReset={() => {
          resetProject()
          setStep('landing')
        }}
        onUpdateProject={updateProject}
        onUpdateSelectedSlide={updateSelectedSlide}
        onAddSlide={addSlide}
        onRemoveSlide={removeSlide}
        onMoveSlide={moveSlide}
        onApplyToAll={applyToAll}
        onUpdateGlobalStyle={updateGlobalStyle}
        onUpdateGlobalTextStyle={updateGlobalTextStyle}
        onUpdateGlobalDeviceStyle={updateGlobalDeviceStyle}
        onApplyGlobalToAll={applyGlobalToAll}
        onResetSelectedBackgroundToGlobal={resetSelectedBackgroundToGlobal}
        onResetSelectedDeviceToGlobal={resetSelectedDeviceToGlobal}
        onSetExportSize={setExportSize}
      />
    )
  }

  return <LandingPage onChooseDevice={chooseDevice} />
}

export default App
