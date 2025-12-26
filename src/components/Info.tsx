import type { SetStateAction } from 'preact/compat'
import type { Dispatch } from 'preact/hooks'

export function Info({ setState }: { setState: Dispatch<SetStateAction<boolean>> }) {
  return (
    <div class="loading" onClick={() => setState(s => !s)}>
      <h1>격식 있는 연하장 생성기</h1>
      <p></p>
    </div>
  )
}
