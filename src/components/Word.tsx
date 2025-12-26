import type { ComponentChildren, ComponentProps } from 'preact'

type WordProps = {
  children: ComponentChildren
  selected?: boolean
  excluded?: boolean
  hide?: boolean
  onClick?: () => void
} & ComponentProps<'span'>

export function Word({ hide, selected, excluded, onClick, children, ...props }: WordProps) {
  if (hide) return null
  return (
    <span class={`word ${excluded ? 'excluded' : ''}`} data-selected={selected ? 'true' : undefined} onClick={onClick} {...props}>
      {children}
    </span>
  )
}
