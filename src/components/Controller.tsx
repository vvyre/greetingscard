import { useContext, useState } from 'preact/hooks'
import { saveCard } from '../utils/pdf'
import { waitTwoFrames } from '../utils/waitFrame'
import { WritingStatusContext, ThemeContext } from './Providers'
import { InfoCircledIcon, LoopIcon } from '@radix-ui/react-icons'
import { Info } from './Info'

export function Controller() {
  const { status, saving, setStatus, setSaving } = useContext(WritingStatusContext)
  const { theme: color, layoutSize, refresh } = useContext(ThemeContext)
  const { w, h } = layoutSize
  const [displayInfo, setDisplayInfo] = useState(false)

  const onMain = async () => {
    if (status === 'editing') {
      setStatus('completed')
    }
    if (status === 'completed') {
      setSaving(true)
      try {
        await waitTwoFrames()
        await document.fonts?.ready
        await saveCard()
      } finally {
        setStatus('finished')
        setSaving(false)
      }
    }
    if (status === 'finished') {
      window.location.reload()
    }
  }

  const buttonText = status === 'editing' ? '작성하기' : status === 'completed' ? '저장' : '다시 작성'

  return (
    <>
      <button
        style={{ transform: `translate(-${w}dvw, -${h}dvh)`, color: color.color, border: `1.5px dotted ${color.color}` }}
        class="complete-btn"
        type="button"
        onClick={onMain}
        disabled={saving}>
        {buttonText}
      </button>
      <button
        style={{ color: color.color, border: `1.5px dotted ${color.color}` }}
        class="change-btn"
        type="button"
        onClick={() => refresh()}
        disabled={saving}>
        <LoopIcon width="1.1rem" height="1.1rem" />
      </button>
      <button
        style={{ color: displayInfo ? '#fff' : color.color, border: `1.5px dotted ${displayInfo ? '#fff' : color.color}` }}
        class="info-btn"
        type="button"
        onClick={() => setDisplayInfo(prev => !prev)}
        disabled={saving}>
        <InfoCircledIcon width="1.25rem" height="1.25rem" />
      </button>
      {displayInfo ? <Info setState={setDisplayInfo} /> : null}
    </>
  )
}
