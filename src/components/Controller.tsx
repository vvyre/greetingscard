import { useContext, useState } from 'preact/hooks'
import { saveCard } from '../utils/pdf'
import { waitTwoFrames } from '../utils/waitFrame'
import { WritingStatusContext, ThemeContext, EditorContext } from './Providers'
import { InfoCircledIcon, LoopIcon } from '@radix-ui/react-icons'
import { Info } from './Info'
import { overlay } from 'overlay-kit'
import { Alert } from './Alert'

export function Controller() {
  const { status, saving, setStatus, setSaving } = useContext(WritingStatusContext)
  const { theme: color, layoutSize, refresh } = useContext(ThemeContext)
  const { selected, username, chosenTier4, setChosenTier4 } = useContext(EditorContext)
  const { w, h } = layoutSize
  const [displayInfo, setDisplayInfo] = useState(false)

  const alert = (msg: string) =>
    overlay.open(({ isOpen, close }: { isOpen: boolean; close: () => void; unmount: () => void }) => (
      <Alert open={isOpen} onClose={close} msg={msg} />
    ))

  const onMain = async (go_back?: boolean) => {
    if (status === 'editing') {
      if (selected.size === 0) return alert('하나 이상의 말을 선택하세요')
      return setStatus('completed')
    }
    if (status === 'completed' && go_back) {
      setChosenTier4(null)
      return setStatus('editing')
    }
    if (status === 'completed') {
      if (username.length < 1) return alert('작성자 이름을 입력하세요')
      if (chosenTier4 === null || chosenTier4.length === 0) return alert('맺음말을 완성해 주세요')
      setSaving(true)
      alert('카드를 저장하는 중입니다...')
      try {
        await waitTwoFrames()
        await document.fonts?.ready
        await saveCard()
      } finally {
        setStatus('finished')
        setSaving(false)
        alert('카드를 저장했어요')
      }
    }
    if (status === 'finished' && go_back) {
      setChosenTier4(null)
      return setStatus('completed')
    }
    if (status === 'finished') return window.location.reload()
  }

  const buttonText = status === 'editing' ? '선택 완료' : status === 'completed' ? '저장' : '초기화'

  return (
    <>
      <div class="complete-btn-layout" style={{ transform: `translate(-${w}dvw, -${h}dvh)`, border: `1.5px dotted ${color.color}` }}>
        {(() => {
          switch (status) {
            case 'editing':
              return (
                <>
                  <button style={{ color: color.color }} class="complete-btn-full" type="button" onClick={() => onMain()} disabled={saving}>
                    {buttonText}
                  </button>
                </>
              )
            default:
              return (
                <>
                  <button
                    aria-label={status === 'completed' ? '본문 편집하기' : '작성자 편집하기'}
                    style={{ color: color.color }}
                    class="complete-btn"
                    type="button"
                    onClick={() => onMain(true)}
                    disabled={saving}>
                    뒤로
                  </button>
                  <button style={{ color: color.color }} class="complete-btn" type="button" onClick={() => onMain()} disabled={saving}>
                    {buttonText}
                  </button>
                </>
              )
          }
        })()}
      </div>
      <button
        style={{ color: color.color, border: `1.5px dotted ${color.color}` }}
        class="change-btn"
        type="button"
        onClick={() => refresh()}
        disabled={saving}>
        색상 변경
      </button>
      <button
        aria-label="사이트 정보 보기"
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
