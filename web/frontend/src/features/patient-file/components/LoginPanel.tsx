import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { PATIENT_FILE_ERRORS } from '../../../constants/patient-file'
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginPanel() {
  const { form, onSubmit, formError } = useLoginForm()
  const { register, formState } = form

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-16 max-w-md rounded-xl border border-border bg-card p-6"
    >
      <h1 className="text-xl font-semibold">Ouvrir une session</h1>
      <p className="mt-2 text-sm text-muted-foreground">{PATIENT_FILE_ERRORS.session}</p>
      <label className="mt-5 block text-sm font-medium" htmlFor="email">
        Email
      </label>
      <Input
        id="email"
        type="email"
        autoComplete="username"
        className="mt-1"
        {...register('email')}
      />
      {formState.errors.email ? (
        <p className="mt-1 text-xs text-warning-foreground">{formState.errors.email.message}</p>
      ) : null}
      <label className="mt-4 block text-sm font-medium" htmlFor="password">
        Mot de passe
      </label>
      <Input
        id="password"
        type="password"
        autoComplete="current-password"
        className="mt-1"
        {...register('password')}
      />
      {formState.errors.password ? (
        <p className="mt-1 text-xs text-warning-foreground">{formState.errors.password.message}</p>
      ) : null}
      {formError ? (
        <p role="alert" className="mt-3 text-sm text-warning-foreground">
          {formError}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={formState.isSubmitting}
        className="mt-5"
      >
        Se connecter
      </Button>
    </form>
  )
}
