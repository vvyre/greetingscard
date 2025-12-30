export function isKakaoInApp() {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('kakaotalk')
}
