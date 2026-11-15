import { BrandMark } from './BrandMark'
import { HumanValidationBanner } from './DemoNotice'
import { SESSION_CHECK_MESSAGE, SESSION_ERROR_MESSAGE } from '../../constants/auth'

type SessionStatusScreenProps = { isError: boolean; onRetry: () => void }

// Écran plein page pendant que la session est vérifiée, ou quand la vérification a échoué.
export function SessionStatusScreen({ isError, onRetry }: SessionStatusScreenProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-8 text-center">
      <BrandMark />
      <h1 className="text-2xl font-semibold">Espace de démonstration</h1>
      <HumanValidationBanner />
      {isError ? (
        <>
          <p role="alert" className="text-sm text-warning-foreground">
            {SESSION_ERROR_MESSAGE}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Réessayer
          </button>
        </>
      ) : (
        <p role="status" className="text-sm text-muted-foreground">
          {SESSION_CHECK_MESSAGE}
        </p>
      )}
    </main>
  )
}
