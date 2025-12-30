import type { SetStateAction } from 'preact/compat'
import { useMemo, type Dispatch } from 'preact/hooks'
import desc from '../assets/docs/desc.txt?raw'

export function Info({ setState }: { setState: Dispatch<SetStateAction<boolean>> }) {
  const txt = useMemo(() => desc.split('\n'), [])
  return (
    <div class="info" onClick={() => setState(s => !s)}>
      <h1>격식 있는 연하장 생성기</h1>
      <>
        {txt.map((t, i) => (
          <p class="info-txt" key={i}>
            {t}
          </p>
        ))}
      </>
    </div>
  )
}
