import type { SetStateAction } from 'preact/compat'
import { useMemo, type Dispatch } from 'preact/hooks'
import desc from '../assets/docs/desc.txt?raw'
import img from '../assets/logo.svg'

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
      <img src={img} alt="hoi logo" class="logo" />
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfJPUrMG4ifxN7xE6qvyAscrzU3dA95GdnT0ulmkp_fO2qWxA/viewform?usp=sharing&ouid=115863162269024975697"
        target="_blank"
        rel="noopener noreferrer"
        class="kakao-overlay-btn"
        onClick={e => e.stopPropagation()}>
        피드백 보내기
      </a>
    </div>
  )
}
