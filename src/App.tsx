import { useMemo, useState } from 'preact/hooks'
import { Word } from './components/Word'
import { saveCard } from './utils/pdf'
import { loadWords } from './utils/words'
import { waitTwoFrames } from './utils/waitFrame'
import { Info } from './components/Info'

type Status = 'editing' | 'completed' | 'finished'

export function App() {
  const { tier1, tier2, tier3, tier4 } = useMemo(() => loadWords(), [])
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [status, setStatus] = useState<Status>('editing')
  const [username, setUsername] = useState('')
  const [chosenTier4, setChosenTier4] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [displayInfo, setDisplayInfo] = useState(false)

  const toggle = (w: string) => {
    if (status === 'editing')
      setSelected(prev => {
        const next = new Set(prev)
        next.has(w) ? next.delete(w) : next.add(w)
        return next
      })
  }

  const onTier4 = (w: string) => {
    if (status !== 'completed') return
    setChosenTier4(w)
  }

  const onMain = async () => {
    if (status === 'editing') {
      setStatus('completed')
    }
    if (status === 'completed') {
      setSaving(true)
      await waitTwoFrames()
      await document.fonts?.ready
      try {
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

  const buttonText = status === 'editing' ? '완성하기' : status === 'completed' ? '저장하기' : '다시 쓰기'

  const words = [...tier1, ...tier2, ...tier3]

  const showEditor = status === 'completed' && !saving

  return (
    <>
      <div class={`${saving ? 'loading' : ''}`} />
      <div id="card" class="container">
        <div class="words">
          {words.map(w => {
            const isSelected = selected.has(w)
            const excluded = status !== 'editing' && !isSelected
            return (
              <Word excluded={excluded} selected={isSelected ? true : undefined} onClick={() => toggle(w)}>
                {w}
              </Word>
            )
          })}
        </div>

        <footer>
          {status !== 'editing' && (
            <div class="tier4">
              {showEditor ? (
                <input class="username" value={username} placeholder="작성자" onInput={(e: any) => setUsername(e.currentTarget.value)} autoFocus />
              ) : (
                <Word excluded={!username} selected>
                  {username || '작성자'}
                </Word>
              )}

              {tier4.map(w => {
                const isChosen = chosenTier4 === w
                const hidden = (chosenTier4 && !isChosen) || undefined
                return (
                  <Word hide={hidden} excluded={hidden} selected={isChosen} onClick={() => onTier4(w)}>
                    {w}
                  </Word>
                )
              })}
            </div>
          )}
        </footer>
      </div>

      <button class="complete-btn" type="button" onClick={onMain} disabled={saving}>
        {buttonText}
      </button>

      <button class="info-btn" type="button" onClick={() => setDisplayInfo(prev => !prev)} disabled={saving}>
        ?
      </button>
      {displayInfo ? <Info setState={setDisplayInfo} /> : null}
    </>
  )
}
