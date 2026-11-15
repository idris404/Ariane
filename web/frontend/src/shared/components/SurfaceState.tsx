import { Alert } from '@/components/ui/alert'
import type { ReactNode } from 'react'

const appearance = {
  loading: { icon: '◌', style: 'bg-background text-muted-foreground' },
  empty: { icon: '○', style: 'bg-background text-muted-foreground' },
  incomplete: { icon: '–', style: 'bg-secondary text-secondary-foreground' },
  contradictory: { icon: '⇄', style: 'bg-warning-soft text-warning-foreground' },
  error: { icon: '!', style: 'bg-destructive-soft text-destructive-ink' },
} as const

export function SurfaceState({
  state,
  title,
  children,
}: {
  state: keyof typeof appearance
  title: string
  children?: ReactNode
}) {
  const { icon, style } = appearance[state]
  return (
    <Alert
      role={state === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl p-5 ${style}`}
    >
      <span
        aria-hidden="true"
        className="grid size-7 shrink-0 place-items-center rounded-full border border-current font-semibold"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        {children ? <div className="mt-1 text-sm">{children}</div> : null}
      </div>
    </Alert>
  )
}
