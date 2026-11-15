import { APP_NAME } from '../../constants/app'

export function BrandMark() {
  return (
    <span className="inline-flex items-center gap-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="size-10 shrink-0 text-primary"
        fill="none"
      >
        <rect width="40" height="40" rx="14" fill="currentColor" />
        <g stroke="var(--color-primary-foreground)" strokeWidth="1.8">
          <path d="M13 13 27 27M13 27l14-14" />
          <circle cx="13" cy="13" r="3.5" fill="currentColor" />
          <circle cx="27" cy="27" r="3.5" fill="currentColor" />
          <circle cx="13" cy="27" r="3.5" fill="currentColor" />
          <circle cx="27" cy="13" r="3.5" fill="currentColor" />
        </g>
      </svg>
      <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
        {APP_NAME}
      </span>
    </span>
  )
}
