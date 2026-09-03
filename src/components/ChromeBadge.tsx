import type { ReactNode } from 'react'

export function ChromeBadge({ children }: { children: ReactNode }) {
  return <span className="chrome-badge">{children}</span>
}
