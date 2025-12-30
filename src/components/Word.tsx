import type { ComponentChildren, ComponentProps } from 'preact'
import type { colors } from '../utils/colors'

type WordProps = {
  theme?: Record<keyof (typeof colors)[number], string>
  children: ComponentChildren
  selected?: boolean
  excluded?: boolean
  hide?: boolean
  onClick?: () => void
} & ComponentProps<'span'>

export function Word({ theme, hide, selected, excluded, onClick, children, ...props }: WordProps) {
  if (hide) return null
  return (
    <span style={theme} class={`word ${excluded ? 'excluded' : ''}`} data-selected={selected ? 'true' : undefined} onClick={onClick} {...props}>
      {children}
    </span>
  )
}
