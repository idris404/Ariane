import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HumanValidationBanner } from '../../shared/components/DemoNotice'
import { BrandMark } from '../../shared/components/BrandMark'
import { useLoginForm } from './hooks/useLoginForm'

const INPUT_CLASS =
  'w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 aria-invalid:border-warning-foreground'

export function LoginPage() {
  const { register, errors, isPending, onSubmit } = useLoginForm()

  return (
    <main className="mx-auto flex min-h-screen max-w-[1440px] flex-col p-5 sm:p-10 lg:p-14">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <BrandMark />
        <span className="text-xs text-muted-foreground">
          Transplantation rénale · Démonstrateur
        </span>
      </header>
      <div className="mt-6">
        <HumanValidationBanner />
      </div>
      <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <section>
          <p className="eyebrow">Revue immunologique</p>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.12] sm:text-5xl lg:text-[60px]">
            Relier l’historique.
            <br />
            <span className="text-primary">Éclairer la revue.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Les données, leur contexte et leurs limites, réunis pour accompagner votre lecture.
          </p>
          <ol className="mt-9 flex flex-col gap-5 border-l border-border pl-6 text-sm text-muted-foreground">
            <li>
              <span className="mr-3 font-semibold text-primary">01</span>Retrouver le dossier
              synthétique
            </li>
            <li>
              <span className="mr-3 font-semibold text-primary">02</span>Parcourir l’évolution
              sérique
            </li>
            <li>
              <span className="mr-3 font-semibold text-primary">03</span>Vérifier avant toute
              signature
            </li>
          </ol>
        </section>
        <Card role="region" aria-labelledby="login-title" className="panel w-full max-w-lg p-6 sm:p-9">
          <p className="mt-6 text-xs font-semibold tracking-wider text-primary uppercase">
            Votre espace de démonstration
          </p>
          <h2 id="login-title" className="mt-3 text-3xl font-bold text-foreground">
            Bienvenue sur Ariane
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Connectez-vous pour ouvrir les dossiers synthétiques.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={INPUT_CLASS}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-warning-foreground">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={INPUT_CLASS}
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" className="text-xs text-warning-foreground">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errors.root && (
              <p
                role="alert"
                className="rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning-foreground"
              >
                {errors.root.message}
              </p>
            )}

            <Button type="submit" disabled={isPending} className="button-primary mt-2 w-full">
              {isPending ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Accès réservé à la démonstration. Aucune décision clinique autonome.
          </p>
        </Card>
      </div>
    </main>
  )
}
