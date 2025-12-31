import { useContext } from 'preact/hooks'
import { Word } from './components/Word'
import { EditorContext, ThemeContext, WordsContext, WritingStatusContext } from './components/Providers'
import { Controller } from './components/Controller'

export function App() {
  const { tier1, tier2, tier3, tier4 } = useContext(WordsContext)
  const { status, saving } = useContext(WritingStatusContext)
  const { theme: color } = useContext(ThemeContext)
  const { selected, setSelected, username, setUsername, chosenTier4, setChosenTier4 } = useContext(EditorContext)

  const handleChooseWord = (w: string) => {
    if (status === 'editing')
      setSelected(prev => {
        const next = new Set(prev)
        next.has(w) ? next.delete(w) : next.add(w)
        return next
      })
  }

  const showT4 = status === 'completed' && !saving
  const handleT4Word = (w: string) => {
    if (status !== 'completed') return
    setChosenTier4(w)
  }

  return (
    <div class="frame" style={color}>
      <div id="card" class="container">
        <div class="words">
          {[...tier1, ...tier2, ...tier3].map(w => {
            const isSelected = selected.has(w)
            const excluded = status !== 'editing' && !isSelected
            return (
              <Word theme={color} excluded={excluded} selected={isSelected ? true : undefined} onClick={() => handleChooseWord(w)}>
                {w}
              </Word>
            )
          })}
        </div>

        <footer>
          {status !== 'editing' && (
            <div class="tier4">
              {showT4 ? (
                <input
                  class="username"
                  style={{ ...color, outline: `1px dotted ${color.color}` }}
                  value={username}
                  placeholder="작성자"
                  onInput={(e: any) => setUsername(e.currentTarget.value)}
                  autoFocus
                />
              ) : (
                <Word theme={color} excluded={!username} selected>
                  {username || '작성자'}
                </Word>
              )}

              {tier4.map(w => {
                const isChosen = chosenTier4 === w
                const hidden = (chosenTier4 && !isChosen) || undefined
                return (
                  <Word theme={color} hide={hidden} excluded={hidden} selected={isChosen} onClick={() => handleT4Word(w)}>
                    {w}
                  </Word>
                )
              })}
            </div>
          )}
        </footer>
      </div>
      <Controller />
    </div>
  )
}
