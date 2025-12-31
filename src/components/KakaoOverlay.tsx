import { Cross2Icon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'preact/hooks'

export function KakaoOverlay() {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    let T: number
    if (isCopied) {
      navigator.clipboard.writeText(location.href)
      T = setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }

    return () => clearTimeout(T)
  }, [isCopied])
  return (
    <div class="kakao-overlay">
      <span>
        <Cross2Icon width="32" height="32" />
      </span>
      <br />
      <span>카카오톡 브라우저에서는 연하장을 작성할 수 없어요</span>
      <span>다른 브라우저를 이용해 주세요</span>
      <br />
      <button class="kakao-overlay-btn" type="button" onClick={() => setIsCopied(true)}>
        {isCopied ? '복사되었습니다' : '주소 복사'}
      </button>
    </div>
  )
}
