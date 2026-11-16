import Link from 'next/link'

import { ROUTES } from '../../constants/routes'

const capabilities = [
  ['01', 'Importer', 'Un parcours local et reproductible à partir de données entièrement synthétiques.'],
  ['02', 'Structurer', 'L’historique sérique et les événements utiles sont réunis dans une lecture longitudinale.'],
  ['03', 'Orienter', 'Les dossiers sont préparés pour la signature ou conservés pour une revue approfondie.'],
  ['04', 'Valider', 'Le biologiste vérifie les éléments affichés et reste responsable de la décision finale.'],
] as const

const architecture = [
  ['Données', 'Profils et historiques synthétiques'],
  ['Pipeline', 'Traitement déterministe et versionné'],
  ['API', 'FastAPI et contrats Pydantic'],
  ['Produit', 'Next.js et validation humaine'],
] as const

export function LandingPage() {
  return (
    <main className="landing min-h-screen overflow-hidden bg-background text-foreground">
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>

      <header className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-6 sm:px-10 lg:px-14">
        <Link href={ROUTES.landing} aria-label="Ariane — accueil" className="flex items-center">
          <img src="/ariane-logo.png" alt="Ariane" className="h-auto w-40 sm:w-48" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex" aria-label="Navigation de présentation">
          <a href="#solution" className="hover:text-foreground">La solution</a>
          <a href="#demo" className="hover:text-foreground">Démonstration</a>
          <a href="#architecture" className="hover:text-foreground">Architecture</a>
        </nav>
        <Link href={ROUTES.login} className="button-primary">
          Ouvrir Ariane
        </Link>
      </header>

      <section id="contenu" className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pt-12 pb-20 sm:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:px-14 lg:pt-20 lg:pb-28">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-brand-soft px-4 py-2 text-sm font-semibold text-primary">
            <span aria-hidden="true">✦</span>
            Prix de la meilleure solution pour les patients
          </div>
          <p className="eyebrow mt-10">AI for Health · 50 heures pour agir</p>
          <h1 className="mt-5 max-w-3xl text-[clamp(3rem,7vw,6.75rem)] leading-[0.95] font-bold tracking-[-0.06em]">
            Rendre du temps
            <span className="mt-2 block text-primary">à l’expertise.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Ariane prépare la revue immunologique de dossiers synthétiques, rend l’historique lisible et laisse chaque validation au biologiste.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#demo" className="button-primary min-h-12 px-5 text-base">Voir la démonstration</a>
            <a href="#solution" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-border bg-card px-5 text-base font-semibold hover:border-primary/40 hover:bg-brand-soft">
              Comprendre Ariane
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Données synthétiques · Démonstrateur · Validation humaine obligatoire</p>
        </div>

        <div className="relative">
          <div aria-hidden="true" className="absolute -top-8 -right-10 h-40 w-40 rounded-[3rem] bg-secondary" />
          <figure className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-panel sm:p-5">
            <img src="/showcase/signing-queue-full.png" alt="File de validation Ariane affichant des dossiers synthétiques à relire" className="w-full rounded-[1.25rem] border border-border" />
            <figcaption className="flex flex-wrap items-center justify-between gap-3 px-2 pt-4 text-xs text-muted-foreground">
              <span>Interface réelle du prototype</span>
              <span className="rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground">○ Validation humaine</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-border sm:grid-cols-3">
          <article className="bg-card px-7 py-10 sm:px-10 lg:px-14">
            <p className="text-5xl font-bold text-primary">3 jours</p>
            <p className="mt-2 text-sm text-muted-foreground">pour passer du besoin terrain à un prototype complet</p>
          </article>
          <article className="bg-card px-7 py-10 sm:px-10 lg:px-14">
            <p className="text-5xl font-bold text-primary">1 000</p>
            <p className="mt-2 text-sm text-muted-foreground">profils synthétiques dans le scénario présenté au jury</p>
          </article>
          <article className="bg-card px-7 py-10 sm:px-10 lg:px-14">
            <p className="text-5xl font-bold text-primary">100 %</p>
            <p className="mt-2 text-sm text-muted-foreground">des validations finales restent humaines</p>
          </article>
        </div>
      </section>

      <section id="solution" className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow">Le problème</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Quand la routine prend le temps de l’expertise.</h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              La revue immunologique demande de reconstituer un historique, de confronter les résultats et de repérer les dossiers qui exigent une attention particulière. Ariane organise cette lecture sans remplacer le professionnel.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map(([number, title, text]) => (
              <article key={number} className="panel min-h-60 p-7 sm:p-8">
                <span className="font-heading text-sm font-bold text-primary">{number}</span>
                <h3 className="mt-12 text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="bg-[#202333] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 sm:px-10 lg:grid-cols-[0.72fr_1.28fr] lg:px-14 lg:py-32">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#a7a8ff] uppercase">Démonstration</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Ariane, en action.</h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
              Du chargement des profils synthétiques jusqu’à la file de validation, la démonstration montre le parcours réellement construit pendant le hackathon.
            </p>
            <ul className="mt-9 space-y-4 text-sm text-white/75">
              <li className="flex gap-3"><span className="text-[#a7a8ff]">01</span> Import et analyse simulés</li>
              <li className="flex gap-3"><span className="text-[#a7a8ff]">02</span> Historique sérique longitudinal</li>
              <li className="flex gap-3"><span className="text-[#a7a8ff]">03</span> Files « À signer » et « À consulter »</li>
              <li className="flex gap-3"><span className="text-[#a7a8ff]">04</span> Vérification explicite avant signature</li>
            </ul>
          </div>
          <div>
            <video controls playsInline preload="metadata" poster="/showcase/dashboard.jpg" className="aspect-video w-full rounded-[1.5rem] border border-white/15 bg-black object-cover" aria-label="Vidéo de démonstration Ariane">
              <source src="/showcase/demo-ariane.mp4" type="video/mp4" />
            </video>
            <p className="mt-4 text-sm text-white/55">29 secondes · parcours local · données synthétiques</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Résultat du scénario</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">La routine préparée. Les cas complexes visibles.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Sur les 1 000 profils synthétiques présentés, Ariane a préparé 714 dossiers pour la file de validation et conservé 286 dossiers pour une revue approfondie.
            </p>
            <p className="mt-5 rounded-2xl bg-warning-soft p-4 text-sm leading-6 text-warning-foreground">
              ◇ Résultat de démonstration sur un jeu synthétique. Cette répartition ne constitue pas une performance clinique.
            </p>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-8 sm:p-10">
            <div className="flex items-end justify-between gap-5 border-b border-border pb-8">
              <div><p className="text-6xl font-bold text-primary">714</p><p className="mt-2 text-sm text-muted-foreground">à valider</p></div>
              <div className="text-right"><p className="text-4xl font-bold">286</p><p className="mt-2 text-sm text-muted-foreground">à approfondir</p></div>
            </div>
            <div className="mt-8 flex h-5 overflow-hidden rounded-full" role="img" aria-label="714 dossiers à valider et 286 dossiers à approfondir sur 1000">
              <span className="block w-[71.4%] bg-primary" />
              <span className="block w-[28.6%] bg-warning" />
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="border-y border-border bg-secondary/45">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
          <div className="max-w-3xl">
            <p className="eyebrow">Architecture</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Un produit complet, local et explicable.</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Le calcul reste dans le backend. L’interface présente les résultats et leurs limites, sans dupliquer les règles métier.</p>
          </div>
          <div className="mt-12 grid gap-3 lg:grid-cols-4">
            {architecture.map(([title, text], index) => (
              <article key={title} className="relative rounded-2xl border border-border bg-card p-6">
                <span className="text-xs font-semibold text-primary">0{index + 1}</span>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                {index < architecture.length - 1 ? <span aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-primary lg:flex">→</span> : null}
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Pydantic', 'TanStack Query', 'Playwright'].map((item) => <span key={item} className="rounded-full border border-border bg-card px-3 py-1.5">{item}</span>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
        <div className="grid gap-12 rounded-[2rem] bg-accent p-8 sm:p-12 lg:grid-cols-[0.72fr_1.28fr] lg:p-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-accent-foreground uppercase">Conception responsable</p>
            <h2 className="mt-4 text-4xl font-bold">Le biologiste garde la main.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ['○', 'Validation humaine', 'Aucun dossier n’est validé automatiquement.'],
              ['◇', 'Données synthétiques', 'Aucune donnée patient réelle dans le démonstrateur.'],
              ['?', 'Incertitude visible', 'Les informations manquantes ne sont jamais interprétées comme favorables.'],
              ['◎', 'Calcul déterministe', 'Le cœur du parcours reste reproductible et utilisable localement.'],
            ].map(([symbol, title, text]) => (
              <article key={title} className="rounded-2xl bg-white/70 p-5">
                <span aria-hidden="true" className="text-xl text-accent-foreground">{symbol}</span>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-end lg:px-14 lg:py-24">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-white uppercase">AI for Health · Paris</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-bold sm:text-6xl">Une solution née en 50 heures, récompensée pour sa valeur patient.</h2>
            <p className="mt-6 text-white">13–15 novembre 2026 · Metafore Boétie Saint-Augustin</p>
          </div>
          <a href="https://hackathons-artefactadoptai.agorize.com/fr/challenges/hackathon-adopt-ai-for-health?lang=fr" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-5 font-semibold text-primary hover:bg-secondary">
            Découvrir le hackathon ↗
          </a>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-12 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div>
          <img src="/ariane-logo.png" alt="Ariane" className="h-auto w-40" />
          <p className="mt-3 text-sm text-muted-foreground">La revue, en perspective.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="https://github.com/idris404/Ariane" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-muted">Voir le dépôt GitHub</a>
          <Link href={ROUTES.login} className="button-primary">Ouvrir le démonstrateur</Link>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Ariane · Tous droits réservés</p>
      </footer>
    </main>
  )
}
