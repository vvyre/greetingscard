import { useLayoutEffect, useState } from 'preact/hooks'

export function useTransform() {
  const [maxWH, setMaxWH] = useState<[number, number]>([0, 0])

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      const randomX = Math.floor(Math.random() * 80) + 10
      const randomY = Math.floor(Math.random() * 80) + 10
      setMaxWH([randomX, randomY])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return maxWH
}
