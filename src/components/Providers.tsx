import { createContext, type ComponentChildren } from 'preact'
import { colors, useRandomColors } from '../utils/colors'
import { useTransform } from '../utils/useTransform'
import { useMemo, useState, type Dispatch } from 'preact/hooks'
import { loadWords } from '../utils/words'
import type { SetStateAction } from 'preact/compat'
import { OverlayProvider } from 'overlay-kit'
import { useKakakoBrowser } from '../utils/useKakaoBrowser'

export type Theme = {
  theme: (typeof colors)[number]
  layoutSize: { w: number; h: number }
  refresh: () => void
}
export type WritingStatus = {
  status: 'editing' | 'completed' | 'finished'
  setStatus: (status: 'editing' | 'completed' | 'finished') => void
  saving: boolean
  setSaving: (saving: boolean) => void
}

export const ThemeContext = createContext<Theme>({ theme: colors[0], layoutSize: { w: 0, h: 0 }, refresh: () => {} })

export const WritingStatusContext = createContext<WritingStatus>({
  status: 'editing',
  setStatus: () => {},
  saving: false,
  setSaving: () => {},
})

export const WordsContext = createContext<{ tier1: string[]; tier2: string[]; tier3: string[]; tier4: string[] }>({
  tier1: [],
  tier2: [],
  tier3: [],
  tier4: [],
})

export const EditorContext = createContext<{
  selected: Set<string>
  setSelected: Dispatch<SetStateAction<Set<string>>>
  username: string
  setUsername: Dispatch<SetStateAction<string>>
  chosenTier4: string | null
  setChosenTier4: Dispatch<SetStateAction<string | null>>
}>(null!)

export function Providers({ children }: { children: ComponentChildren }) {
  const words = useMemo(() => loadWords(), [])
  const [status, setStatus] = useState<'editing' | 'completed' | 'finished'>('editing')
  const [saving, setSaving] = useState(false)
  const [color, refresh] = useRandomColors()
  const [w, h] = useTransform()
  const [selected, setSelected] = useState<Set<string>>(() => new Set<string>())
  const [username, setUsername] = useState('')
  const [chosenTier4, setChosenTier4] = useState<string | null>(null)
  useKakakoBrowser()
  return (
    <WordsContext.Provider value={words}>
      <ThemeContext.Provider value={{ theme: color, layoutSize: { w, h }, refresh }}>
        <WritingStatusContext.Provider value={{ status, setStatus, saving, setSaving }}>
          <EditorContext.Provider value={{ selected, setSelected, username, setUsername, chosenTier4, setChosenTier4 }}>
            <OverlayProvider>{children}</OverlayProvider>
          </EditorContext.Provider>
        </WritingStatusContext.Provider>
      </ThemeContext.Provider>
    </WordsContext.Provider>
  )
}
