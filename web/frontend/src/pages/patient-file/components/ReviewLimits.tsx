import { SurfaceState } from '../../../shared/components/SurfaceState'

export function ReviewLimits() {
  return (
    <section
      id="review-limits"
      aria-labelledby="review-limits-title"
      className="panel scroll-mt-6 p-5"
    >
      <p className="eyebrow">À garder en perspective</p>
      <h2 id="review-limits-title" className="mt-2">
        Données disponibles et limites
      </h2>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        {[
          ['Version des règles', 'Non transmise pour ce dossier'],
          ['Règles déclenchées et incertitudes', 'Non transmises pour ce dossier'],
          [
            'Contradictions / examens non testés',
            'Information non transmise ; aucune conclusion possible',
          ],
          ['Comparaison de trois donneurs', 'Non disponible dans ce parcours'],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5">
        <SurfaceState state="incomplete" title="La revue reste nécessaire">
          Une donnée absente ne vaut pas un résultat négatif. Les informations non transmises ne
          permettent pas de conclure à l’absence de risque.
        </SurfaceState>
      </div>
    </section>
  )
}
