import { useEffect } from 'preact/hooks'
import { isKakaoInApp } from './isKakao'
import { overlay } from 'overlay-kit'
import { KakaoOverlay } from '../components/KakaoOverlay'

export function useKakakoBrowser() {
  useEffect(() => {
    if (isKakaoInApp()) {
      overlay.open(() => <KakaoOverlay />)
    }
  }, [])
  return null
}
