import { createContext, lazy, Suspense, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { memoryFragments, type MemoryFragment } from '../content/memoryFragments'
import '../styles/memory-fragments.css'

const DeferredMemoryFragmentReveal = lazy(() => import('./MemoryFragmentReveal').then((module) => ({
  default: module.MemoryFragmentReveal,
})))

type MemoryFragmentContextValue = {
  recovered: Set<string>
  recover: (id: string) => void
  open: (id: string) => void
  dismiss: () => void
  active: MemoryFragment | null
}

const STORAGE_KEY = 'arina-exe:memory-fragments:v1'
const validFragmentIds = new Set(memoryFragments.map((fragment) => fragment.id))
const MemoryFragmentContext = createContext<MemoryFragmentContextValue | null>(null)

function loadRecovered() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    const valid = Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string' && validFragmentIds.has(value))
      : []
    return new Set<string>(valid)
  } catch {
    return new Set<string>()
  }
}

export function MemoryFragmentProvider({ children }: { children: ReactNode }) {
  const [recovered, setRecovered] = useState<Set<string>>(() => new Set())
  const [active, setActive] = useState<MemoryFragment | null>(null)
  const [hasRequestedReveal, setHasRequestedReveal] = useState(false)

  useEffect(() => {
    setRecovered(loadRecovered())
  }, [])

  useEffect(() => {
    if (!active) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active])

  const persist = (next: Set<string>) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
    } catch {
      // The archive still works for the current visit if storage is unavailable.
    }
  }

  const open = (id: string) => {
    const fragment = memoryFragments.find((item) => item.id === id)
    if (fragment) {
      setHasRequestedReveal(true)
      setActive(fragment)
    }
  }

  const recover = (id: string) => {
    const fragment = memoryFragments.find((item) => item.id === id)
    if (!fragment) return

    setHasRequestedReveal(true)
    setRecovered((current) => {
      if (current.has(id)) return current
      const next = new Set(current)
      next.add(id)
      persist(next)
      return next
    })
    setActive(fragment)
  }

  const value = useMemo<MemoryFragmentContextValue>(() => ({
    recovered,
    recover,
    open,
    dismiss: () => setActive(null),
    active,
  }), [active, recovered])

  return (
    <MemoryFragmentContext.Provider value={value}>
      {children}
      {hasRequestedReveal && (
        <Suspense fallback={null}>
          <DeferredMemoryFragmentReveal
            active={active}
            recoveredCount={recovered.size}
            totalCount={memoryFragments.length}
            onDismiss={() => setActive(null)}
          />
        </Suspense>
      )}
    </MemoryFragmentContext.Provider>
  )
}

function useMemoryFragments() {
  const context = useContext(MemoryFragmentContext)
  if (!context) throw new Error('Memory fragments must be used inside MemoryFragmentProvider')
  return context
}

export function MemoryFragmentTrigger({ id, placement = 'inline' }: { id: string; placement?: string }) {
  const { recovered, recover, open } = useMemoryFragments()
  const isRecovered = recovered.has(id)

  return (
    <button
      className={`memory-fragment-trigger memory-fragment-trigger--${placement}${isRecovered ? ' is-recovered' : ''}`}
      type="button"
      aria-label={isRecovered ? 'Открыть найденный фрагмент воспоминания' : 'Скрытый фрагмент воспоминания'}
      onClick={() => isRecovered ? open(id) : recover(id)}
    >
      <span aria-hidden="true">✦</span>
    </button>
  )
}

export function MemoryFragmentSummary() {
  const { recovered } = useMemoryFragments()
  const completed = recovered.size === memoryFragments.length

  return (
    <div className={`memory-fragment-summary${completed ? ' is-complete' : ''}`}>
      <div>
        <span>MEMORIES RECOVERED</span>
        <strong>{recovered.size} / {memoryFragments.length}</strong>
      </div>
      <div className="memory-fragment-summary__track" aria-hidden="true">
        {memoryFragments.map((fragment) => <i className={recovered.has(fragment.id) ? 'is-found' : ''} key={fragment.id} />)}
      </div>
      <small>{completed ? 'ARCHIVE COMPLETE ✦' : 'маленькие ✦ спрятаны внутри истории'}</small>
    </div>
  )
}
