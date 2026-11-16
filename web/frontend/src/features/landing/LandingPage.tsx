import Link from 'next/link'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '../../constants/routes'
import { Reveal } from './Reveal'

const capabilities = [
  ['01', 'Importer', 'Un parcours local et reproductible à partir de données entièrement synthétiques.'],
  ['02', 'Structurer', 'Les résultats et les événements sont réunis dans une lecture longitudinale immédiatement exploitable.'],
  ['03', 'Prioriser', 'La file distingue les dossiers préparés pour validation de ceux qui exigent une revue approfondie.'],
  ['04', 'Valider', 'Le biologiste vérifie chaque dossier et reste seul responsable de la validation finale.'],
] as const

const architecture = [
  ['Données', 'Profils et historiques synthétiques'],
  ['Pipeline', 'Traitement déterministe et versionné'],
  ['API', 'FastAPI et contrats Pydantic'],
  ['Produit', 'Next.js et validation humaine'],
] as const

const safeguards = [
  ['○', 'Validation humaine', 'Aucun dossier n’est validé automatiquement.'],
  ['◇', 'Données synthétiques', 'Aucune donnée patient réelle dans le démonstrateur.'],
  ['?', 'Incertitude visible', 'Une information manquante ne devient jamais une conclusion favorable.'],
  ['◎', 'Calcul déterministe', 'Le cœur du parcours reste reproductible et utilisable localement.'],
] as const

const pilotStages = [
  [
    '01',
    'Déjà construit',
    'Un parcours fonctionnel, local et testé sur 1 000 profils entièrement synthétiques.',
  ],
  [
    '02',
    'Déjà reconnu',
    'Le prix de la meilleure solution pour les patients au hackathon AI for Health.',
  ],
  [
    '03',
    'À mesurer en pilote',
    'La capacité à réduire la file accumulée, le temps de préparation et les reprises manuelles.',
  ],
] as const

export function LandingPage() {
  return (
    <main className="landing min-h-screen overflow-hidden bg-background text-foreground">
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>

      <header className="landing-shell flex items-center justify-between gap-5 py-5 sm:py-6">
        <Link href={ROUTES.landing} aria-label="Ariane — accueil" className="flex items-center">
          <img src="/ariane-logo.png" alt="Ariane" className="h-auto w-36 sm:w-44" />
        </Link>
        <nav
          className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"
          aria-label="Navigation de présentation"
        >
          <a href="#solution" className="hover:text-foreground">La solution</a>
          <a href="#impact" className="hover:text-foreground">Impact</a>
          <a href="#demo" className="hover:text-foreground">Démonstration</a>
          <a href="#pilote" className="hover:text-foreground">Suite</a>
        </nav>
        <Button asChild size="lg">
          <Link href={ROUTES.login}>Ouvrir Ariane</Link>
        </Button>
      </header>

      <section
        id="contenu"
        aria-labelledby="hero-title"
        className="landing-shell grid items-center gap-12 pt-10 pb-20 lg:grid-cols-[0.92fr_1.08fr] lg:pt-16 lg:pb-28"
      >
        <div className="flex flex-col items-start gap-6">
          <Badge variant="secondary" className="animate-landing-fade-up gap-2 border border-primary/20 bg-brand-soft px-4 py-2 text-sm font-semibold text-primary">
            <span aria-hidden="true">✦</span>
            Prix de la meilleure solution pour les patients
          </Badge>
          <Badge variant="secondary" className="eyebrow animate-landing-fade-up [animation-delay:80ms]">
            Le retard s’accumule. L’expertise ne devrait pas.
          </Badge>
          <h1 id="hero-title" className="landing-display animate-landing-fade-up max-w-[12ch] [animation-delay:140ms]">
            Rattraper le retard.
            <span className="block text-primary">Garder l’expertise.</span>
          </h1>
          <p className="landing-lead animate-landing-fade-up max-w-[42ch] text-muted-foreground [animation-delay:200ms]">
            Ariane prépare la revue répétitive pour aider une équipe à ramener une file accumulée de six mois vers un mois — sans automatiser la décision du biologiste.
          </p>
          <div className="animate-landing-fade-up flex flex-wrap gap-3 [animation-delay:260ms]">
            <Button asChild size="lg" className="min-h-12 text-base">
              <a href="#impact">Voir l’impact visé</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 text-base">
              <a href="#demo">Voir le prototype</a>
            </Button>
          </div>
          <p className="animate-landing-fade-up max-w-xl text-sm leading-6 text-muted-foreground [animation-delay:320ms]">
            Objectif opérationnel à confirmer en pilote · Données synthétiques · Validation humaine obligatoire
          </p>
        </div>

        <div className="animate-landing-pop relative">
          <div aria-hidden="true" className="absolute -top-10 -right-12 h-44 w-44 rounded-[3rem] bg-secondary" />
          <Card className="landing-product relative overflow-hidden rounded-[2rem]">
            <CardContent className="p-3 sm:p-5">
              <figure>
                <img
                  src="/showcase/signing-queue-full.png"
                  alt="File de validation Ariane affichant des dossiers synthétiques à relire"
                  className="w-full rounded-[1.25rem] border border-border"
                />
                <figcaption className="flex flex-wrap items-center justify-between gap-3 px-2 pt-4 text-xs text-muted-foreground">
                  <span>Interface réelle du prototype</span>
                  <Badge variant="secondary" className="bg-accent px-3 py-1 text-accent-foreground">○ Validation humaine</Badge>
                </figcaption>
              </figure>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y border-border bg-card" aria-label="Repères du projet">
        <div className="mx-auto grid max-w-[76rem] gap-px bg-border sm:grid-cols-3">
          <Card role="article" className="rounded-none border-0 shadow-none">
            <CardContent className="px-6 py-9 sm:px-9 lg:px-12">
              <p className="landing-stat text-primary">6 → 1 mois</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">objectif de réduction de la file accumulée, à mesurer en pilote</p>
            </CardContent>
          </Card>
          <Card role="article" className="rounded-none border-0 shadow-none">
            <CardContent className="px-6 py-9 sm:px-9 lg:px-12">
              <p className="landing-stat text-primary">1 000</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">profils synthétiques dans le scénario présenté au jury</p>
            </CardContent>
          </Card>
          <Card role="article" className="rounded-none border-0 shadow-none">
            <CardContent className="px-6 py-9 sm:px-9 lg:px-12">
              <p className="landing-stat text-primary">100 %</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">des validations finales restent entre les mains du professionnel</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="solution" className="landing-shell landing-section">
        <Reveal className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <Badge variant="secondary" className="eyebrow">Le vrai problème</Badge>
            <h2 className="landing-title mt-4 max-w-[13ch]">Ce n’est pas un dossier. C’est la file qui ne cesse de grandir.</h2>
            <p className="landing-lead mt-6 max-w-[43ch] text-muted-foreground">
              Reconstituer les historiques et confronter les résultats mobilise le temps expert sur une tâche répétitive. Pendant ce temps, les dossiers s’accumulent et le retard devient structurel.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map(([number, title, text], index) => (
              <Reveal key={number} delay={index * 70} className="flex">
                <Card role="article" className="landing-card min-h-60 w-full">
                  <CardContent className="flex h-full flex-col p-7 sm:p-8">
                    <Badge variant="secondary" className="px-2.5 text-primary">{number}</Badge>
                    <h3 className="landing-subtitle mt-auto pt-12">{title}</h3>
                    <p className="mt-3 max-w-sm leading-7 text-muted-foreground">{text}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="impact" className="border-y border-border bg-secondary/45">
        <div className="landing-shell landing-section">
          <Reveal className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <Card className="rounded-[2rem] border-primary/15">
              <CardContent className="p-7 sm:p-10">
                <Badge variant="secondary" className="eyebrow">Objectif opérationnel</Badge>
                <div className="mt-9 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div>
                    <p className="landing-impact-number text-muted-foreground">6</p>
                    <p className="mt-1 text-sm font-semibold">mois de retard</p>
                  </div>
                  <div className="landing-backlog-track" aria-hidden="true"><span /></div>
                  <div className="text-right">
                    <p className="landing-impact-number text-primary">1</p>
                    <p className="mt-1 text-sm font-semibold">mois de file cible</p>
                  </div>
                </div>
                <Alert className="mt-8 border-warning/30 bg-warning-soft text-warning-foreground">
                  <AlertDescription className="text-warning-foreground">
                    Projection de capacité issue du besoin terrain. Elle devra être mesurée avec une équipe pilote avant toute communication comme résultat obtenu.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            <div>
              <Badge variant="secondary" className="eyebrow">Changer d’échelle</Badge>
              <h2 className="landing-title mt-4">Le gain ne se compte pas seulement en minutes. Il se voit dans le retard résorbé.</h2>
              <p className="landing-lead mt-6 max-w-[44ch] text-muted-foreground">
                En préparant les dossiers répétitifs et en isolant ceux qui réclament une lecture approfondie, Ariane redonne de la capacité à l’équipe sans raccourcir la vigilance.
              </p>
              <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  'Moins de temps passé à reconstruire le contexte',
                  'Les dossiers complexes restent immédiatement visibles',
                  'Une file de travail claire et priorisée',
                  'Chaque validation reste explicitement humaine',
                ].map((item) => (
                  <li key={item}><Card className="h-full shadow-none"><CardContent className="p-4">{item}</CardContent></Card></li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="demo" className="bg-[#202333] text-white">
        <div className="landing-shell landing-section grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <Reveal>
            <Badge className="border border-white/10 bg-white/10 px-3 py-1 text-[#c8c9ff]">Démonstration</Badge>
            <h2 className="landing-title mt-4">Du dossier brut à une file prête à relire.</h2>
            <p className="landing-lead mt-6 max-w-[40ch] text-white/70">
              Le prototype montre le parcours réellement construit pendant le hackathon, du chargement synthétique jusqu’à la validation explicite.
            </p>
            <ul className="mt-9 space-y-4 text-sm text-white/75">
              <li className="flex gap-3"><span className="text-[#a7a8ff]">01</span> Import et analyse simulés</li>
              <li className="flex gap-3"><span className="text-[#a7a8ff]">02</span> Historique sérique longitudinal</li>
              <li className="flex gap-3"><span className="text-[#a7a8ff]">03</span> Files « À signer » et « À consulter »</li>
              <li className="flex gap-3"><span className="text-[#a7a8ff]">04</span> Vérification explicite avant signature</li>
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <video
              controls
              playsInline
              preload="metadata"
              poster="/showcase/dashboard.jpg"
              className="aspect-video w-full rounded-[1.5rem] border border-white/15 bg-black object-cover"
              aria-label="Vidéo de démonstration Ariane"
            >
              <source src="/showcase/demo-ariane.mp4" type="video/mp4" />
            </video>
            <p className="mt-4 text-sm text-white/55">44 secondes · parcours local · données synthétiques</p>
          </Reveal>
        </div>
      </section>

      <section className="landing-shell landing-section">
        <Reveal className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Badge variant="secondary" className="eyebrow">Résultat du scénario</Badge>
            <h2 className="landing-title mt-4">La routine préparée. Les cas complexes toujours visibles.</h2>
            <p className="landing-lead mt-6 max-w-[44ch] text-muted-foreground">
              Sur 1 000 profils synthétiques, Ariane prépare 714 dossiers pour la file de validation et en conserve 286 pour une revue approfondie.
            </p>
            <Alert className="mt-5 border-warning/30 bg-warning-soft text-warning-foreground">
              <AlertDescription className="text-warning-foreground">
                ◇ Résultat de démonstration. Cette répartition ne constitue ni une performance clinique ni une mesure du gain de temps.
              </AlertDescription>
            </Alert>
          </div>
          <Card className="overflow-hidden rounded-[2rem]">
            <CardContent className="p-8 sm:p-10">
              <div className="flex items-end justify-between gap-5 border-b border-border pb-8">
                <div><p className="landing-impact-number text-primary">714</p><p className="mt-2 text-sm text-muted-foreground">à valider</p></div>
                <div className="text-right"><p className="text-4xl font-semibold">286</p><p className="mt-2 text-sm text-muted-foreground">à approfondir</p></div>
              </div>
              <div className="mt-8 flex h-5 overflow-hidden rounded-full" role="img" aria-label="714 dossiers à valider et 286 dossiers à approfondir sur 1000">
                <span className="landing-progress block w-[71.4%] origin-left bg-primary" />
                <span className="landing-progress block w-[28.6%] origin-left bg-warning [transition-delay:180ms]" />
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </section>

      <section id="architecture" className="border-y border-border bg-secondary/45">
        <div className="landing-shell landing-section">
          <Reveal className="max-w-3xl">
            <Badge variant="secondary" className="eyebrow">Architecture</Badge>
            <h2 className="landing-title mt-4">Un produit complet, local et explicable.</h2>
            <p className="landing-lead mt-6 text-muted-foreground">Le calcul reste dans le backend. L’interface présente les résultats et leurs limites, sans dupliquer les règles métier.</p>
          </Reveal>
          <div className="mt-12 grid gap-3 lg:grid-cols-4">
            {architecture.map(([title, text], index) => (
              <Reveal key={title} delay={index * 80} className="flex">
                <Card role="article" className="landing-card relative w-full">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="text-primary">0{index + 1}</Badge>
                    <h3 className="landing-subtitle mt-8">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                    {index < architecture.length - 1 ? <span aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-primary lg:flex">→</span> : null}
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Pydantic', 'TanStack Query', 'Playwright'].map((item) => <Badge key={item} variant="outline" className="bg-card px-3 py-1.5 text-muted-foreground">{item}</Badge>)}
          </div>
        </div>
      </section>

      <section id="pilote" className="landing-shell landing-section">
        <Reveal className="grid gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:gap-20">
          <div>
            <Badge variant="secondary" className="eyebrow">Du hackathon au pilote</Badge>
            <h2 className="landing-title mt-4">Une preuve de produit aujourd’hui. Une preuve d’impact demain.</h2>
            <p className="landing-lead mt-6 max-w-[43ch] text-muted-foreground">
              Ariane a démontré qu’un parcours complet pouvait être construit. L’étape suivante consiste à mesurer son effet opérationnel dans un cadre encadré, sans déplacer la responsabilité du professionnel.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-8">
              <a href="https://github.com/idris404/Ariane/blob/main/docs/PILOT.md">
                Découvrir la démarche pilote ↗
              </a>
            </Button>
          </div>
          <div className="grid gap-4">
            {pilotStages.map(([number, title, text], index) => (
              <Reveal key={number} delay={index * 70}>
                <Card role="article" className="landing-card">
                  <CardContent className="grid gap-4 p-6 sm:grid-cols-[auto_1fr] sm:gap-6 sm:p-7">
                    <Badge variant="secondary" className="h-fit text-primary">{number}</Badge>
                    <div>
                      <h3 className="landing-subtitle">{title}</h3>
                      <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{text}</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="landing-shell landing-section">
        <Reveal>
          <Card className="rounded-[2rem] border-0 bg-accent shadow-none">
            <CardContent className="grid gap-12 p-8 sm:p-12 lg:grid-cols-[0.72fr_1.28fr] lg:p-16">
              <div>
                <Badge variant="secondary" className="bg-white/70 text-accent-foreground">Conception responsable</Badge>
                <h2 className="landing-title mt-4">Accélérer la préparation. Jamais la décision.</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {safeguards.map(([symbol, title, text]) => (
                  <Card key={title} role="article" className="border-0 bg-white/70 shadow-none">
                    <CardContent className="p-5">
                      <Badge variant="secondary" aria-hidden="true" className="text-accent-foreground">{symbol}</Badge>
                      <h3 className="mt-4 font-bold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </section>

      <section className="landing-shell pb-[clamp(4rem,2.6rem+6vw,7.5rem)]">
        <Reveal>
          <Card className="rounded-[2.5rem] border-0 bg-primary text-white shadow-none">
            <CardContent className="px-6 py-16 text-center sm:px-10 sm:py-24">
              <Badge variant="outline" className="border-white/30 bg-primary-hover text-white">AI for Health · Paris</Badge>
              <h2 className="landing-display mx-auto mt-5 max-w-[16ch]">Rattraper le retard sans raccourcir la vigilance.</h2>
              <p className="landing-lead mx-auto mt-6 max-w-[42ch] text-white">
                Une solution née en 50 heures, récompensée pour sa valeur patient et conçue pour rendre de la capacité aux équipes.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-secondary">
                  <Link href={ROUTES.login}>Ouvrir le démonstrateur</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <a href="https://hackathons-artefactadoptai.agorize.com/fr/challenges/hackathon-adopt-ai-for-health?lang=fr" target="_blank" rel="noreferrer">Découvrir le hackathon ↗</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </section>

      <footer className="landing-shell flex flex-col gap-8 border-t border-border py-12 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <img src="/ariane-logo.png" alt="Ariane" className="h-auto w-36" />
          <p className="mt-3 text-sm text-muted-foreground">Rattraper la file. Préserver la décision.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline"><a href="https://github.com/idris404/Ariane">Voir le dépôt GitHub</a></Button>
          <Button asChild><Link href={ROUTES.login}>Ouvrir Ariane</Link></Button>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Ariane · Tous droits réservés</p>
      </footer>
    </main>
  )
}
