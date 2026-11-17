'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ROUTES } from '../../constants/routes'
import { BrandedVideo } from './BrandedVideo'
import { Reveal } from './Reveal'

type Locale = 'en' | 'fr'

const content = {
  en: {
    skip: 'Skip to content', home: 'Ariane — home', navigation: 'Presentation navigation',
    nav: ['Solution', 'Impact', 'Demo', 'Roadmap'], open: 'Open Ariane',
    award: 'Best Patient Solution Award',
    heroEyebrow: 'THE BACKLOG KEEPS GROWING. EXPERTISE SHOULD NOT BE THE BOTTLENECK.',
    heroTitle: 'Clear the backlog.', heroAccent: 'Keep the expertise.',
    heroLead: 'Ariane prepares repetitive review work to help a team move from six months of accumulated backlog toward one month — without automating the biologist’s decision.',
    impactCta: 'See the target impact', demoCta: 'See the prototype',
    boundary: 'Operational target to be confirmed in a pilot · Synthetic data · Human validation required',
    imageAlt: 'Ariane review queue showing synthetic cases awaiting human review',
    imageCaption: 'Real prototype interface', humanValidation: 'Human validation', landmarks: 'Project highlights',
    stats: [
      ['6 → 1 months', 'target reduction in accumulated backlog, to be measured in a pilot'],
      ['1,000', 'synthetic profiles in the scenario presented to the jury'],
      ['100%', 'of final validations remain in professional hands'],
    ],
    problemEyebrow: 'THE REAL PROBLEM', problemTitle: 'It is not one case. It is the queue that never stops growing.',
    problemLead: 'Reconstructing histories and comparing results keeps experts busy with repetitive work. Meanwhile, cases pile up and the backlog becomes structural.',
    capabilities: [
      ['01', 'Import', 'A local, reproducible workflow built entirely on synthetic data.'],
      ['02', 'Structure', 'Results and events are combined into a longitudinal view that is immediately usable.'],
      ['03', 'Prioritize', 'The queue separates cases prepared for validation from those requiring deeper review.'],
      ['04', 'Validate', 'The biologist checks every case and remains solely responsible for final validation.'],
    ],
    operationalTarget: 'OPERATIONAL TARGET', backlogMonths: 'months of backlog', targetMonth: 'target backlog month',
    projection: 'Capacity projection based on the field need. It must be measured with a pilot team before being communicated as an achieved result.',
    scaleEyebrow: 'CHANGE THE SCALE', scaleTitle: 'The gain is not only measured in minutes. It is visible in the backlog cleared.',
    scaleLead: 'By preparing repetitive cases and isolating those that require deeper review, Ariane restores team capacity without reducing vigilance.',
    benefits: ['Less time spent reconstructing context', 'Complex cases remain immediately visible', 'A clear, prioritized work queue', 'Every validation remains explicitly human'],
    demoEyebrow: 'DEMO', demoTitle: 'From raw case data to a queue ready for review.',
    demoLead: 'The prototype shows the workflow actually built during the hackathon, from synthetic loading to explicit human validation.',
    demoSteps: ['Simulated import and analysis', 'Longitudinal serum history', '“Ready to validate” and “Needs review” queues', 'Explicit verification before validation'],
    videoLabel: 'Ariane demonstration video', resultEyebrow: 'SCENARIO RESULT',
    resultTitle: 'Routine work prepared. Complex cases still visible.',
    resultLead: 'Across 1,000 synthetic profiles, Ariane prepares 714 cases for the validation queue and keeps 286 for deeper review.',
    resultWarning: '◇ Demonstration result. This split is neither a clinical performance metric nor a measured time saving.',
    toValidate: 'ready to validate', toReview: 'to review further',
    resultAria: '714 cases ready to validate and 286 cases to review further out of 1,000',
    architectureEyebrow: 'ARCHITECTURE', architectureTitle: 'A complete, local and explainable product.',
    architectureLead: 'Computation stays in the backend. The interface presents results and their limits without duplicating domain rules.',
    architecture: [['Data', 'Synthetic profiles and histories'], ['Pipeline', 'Deterministic, versioned processing'], ['API', 'FastAPI and Pydantic contracts'], ['Product', 'Next.js and human validation']],
    pilotEyebrow: 'FROM HACKATHON TO PILOT', pilotTitle: 'Product proof today. Impact proof tomorrow.',
    pilotLead: 'Ariane demonstrated that a complete workflow could be built. The next step is to measure its operational effect in a controlled setting without shifting professional responsibility.',
    pilotCta: 'Explore the pilot approach ↗',
    pilotStages: [['01', 'Already built', 'A functional, local workflow tested on 1,000 entirely synthetic profiles.'], ['02', 'Already recognized', 'Best Patient Solution at the AI for Health hackathon.'], ['03', 'To measure in a pilot', 'Backlog reduction, preparation time and manual rework.']],
    responsibleEyebrow: 'RESPONSIBLE BY DESIGN', responsibleTitle: 'Accelerate preparation. Never the decision.',
    safeguards: [['○', 'Human validation', 'No case is ever validated automatically.'], ['◇', 'Synthetic data', 'The demonstrator contains no real patient data.'], ['?', 'Visible uncertainty', 'Missing information is never turned into a favorable conclusion.'], ['◎', 'Deterministic computation', 'The core workflow remains reproducible and usable locally.']],
    ctaTitle: 'Clear the backlog without shortening vigilance.',
    ctaLead: 'Built in 50 hours, awarded for patient value and designed to restore capacity to expert teams.',
    openDemo: 'Open the demo', discoverHackathon: 'Discover the hackathon ↗',
    footerTagline: 'Clear the queue. Preserve the decision.', repository: 'View on GitHub', rights: 'All rights reserved',
  },
  fr: {
    skip: 'Aller au contenu', home: 'Ariane — accueil', navigation: 'Navigation de présentation',
    nav: ['La solution', 'Impact', 'Démonstration', 'Suite'], open: 'Ouvrir Ariane',
    award: 'Prix de la meilleure solution pour les patients',
    heroEyebrow: 'LE RETARD S’ACCUMULE. L’EXPERTISE NE DEVRAIT PAS.', heroTitle: 'Rattraper le retard.', heroAccent: 'Garder l’expertise.',
    heroLead: 'Ariane prépare la revue répétitive pour aider une équipe à ramener une file accumulée de six mois vers un mois — sans automatiser la décision du biologiste.',
    impactCta: 'Voir l’impact visé', demoCta: 'Voir le prototype',
    boundary: 'Objectif opérationnel à confirmer en pilote · Données synthétiques · Validation humaine obligatoire',
    imageAlt: 'File de validation Ariane affichant des dossiers synthétiques à relire', imageCaption: 'Interface réelle du prototype', humanValidation: 'Validation humaine', landmarks: 'Repères du projet',
    stats: [['6 → 1 mois', 'objectif de réduction de la file accumulée, à mesurer en pilote'], ['1 000', 'profils synthétiques dans le scénario présenté au jury'], ['100 %', 'des validations finales restent entre les mains du professionnel']],
    problemEyebrow: 'LE VRAI PROBLÈME', problemTitle: 'Ce n’est pas un dossier. C’est la file qui ne cesse de grandir.',
    problemLead: 'Reconstituer les historiques et confronter les résultats mobilise le temps expert sur une tâche répétitive. Pendant ce temps, les dossiers s’accumulent et le retard devient structurel.',
    capabilities: [['01', 'Importer', 'Un parcours local et reproductible à partir de données entièrement synthétiques.'], ['02', 'Structurer', 'Les résultats et les événements sont réunis dans une lecture longitudinale immédiatement exploitable.'], ['03', 'Prioriser', 'La file distingue les dossiers préparés pour validation de ceux qui exigent une revue approfondie.'], ['04', 'Valider', 'Le biologiste vérifie chaque dossier et reste seul responsable de la validation finale.']],
    operationalTarget: 'OBJECTIF OPÉRATIONNEL', backlogMonths: 'mois de retard', targetMonth: 'mois de file cible',
    projection: 'Projection de capacité issue du besoin terrain. Elle devra être mesurée avec une équipe pilote avant toute communication comme résultat obtenu.',
    scaleEyebrow: 'CHANGER D’ÉCHELLE', scaleTitle: 'Le gain ne se compte pas seulement en minutes. Il se voit dans le retard résorbé.',
    scaleLead: 'En préparant les dossiers répétitifs et en isolant ceux qui réclament une lecture approfondie, Ariane redonne de la capacité à l’équipe sans raccourcir la vigilance.',
    benefits: ['Moins de temps passé à reconstruire le contexte', 'Les dossiers complexes restent immédiatement visibles', 'Une file de travail claire et priorisée', 'Chaque validation reste explicitement humaine'],
    demoEyebrow: 'DÉMONSTRATION', demoTitle: 'Du dossier brut à une file prête à relire.',
    demoLead: 'Le prototype montre le parcours réellement construit pendant le hackathon, du chargement synthétique jusqu’à la validation explicite.',
    demoSteps: ['Import et analyse simulés', 'Historique sérique longitudinal', 'Files « À signer » et « À consulter »', 'Vérification explicite avant signature'],
    videoLabel: 'Vidéo de démonstration Ariane', resultEyebrow: 'RÉSULTAT DU SCÉNARIO', resultTitle: 'La routine préparée. Les cas complexes toujours visibles.',
    resultLead: 'Sur 1 000 profils synthétiques, Ariane prépare 714 dossiers pour la file de validation et en conserve 286 pour une revue approfondie.',
    resultWarning: '◇ Résultat de démonstration. Cette répartition ne constitue ni une performance clinique ni une mesure du gain de temps.',
    toValidate: 'à valider', toReview: 'à approfondir', resultAria: '714 dossiers à valider et 286 dossiers à approfondir sur 1 000',
    architectureEyebrow: 'ARCHITECTURE', architectureTitle: 'Un produit complet, local et explicable.',
    architectureLead: 'Le calcul reste dans le backend. L’interface présente les résultats et leurs limites, sans dupliquer les règles métier.',
    architecture: [['Données', 'Profils et historiques synthétiques'], ['Pipeline', 'Traitement déterministe et versionné'], ['API', 'FastAPI et contrats Pydantic'], ['Produit', 'Next.js et validation humaine']],
    pilotEyebrow: 'DU HACKATHON AU PILOTE', pilotTitle: 'Une preuve de produit aujourd’hui. Une preuve d’impact demain.',
    pilotLead: 'Ariane a démontré qu’un parcours complet pouvait être construit. L’étape suivante consiste à mesurer son effet opérationnel dans un cadre encadré, sans déplacer la responsabilité du professionnel.',
    pilotCta: 'Découvrir la démarche pilote ↗',
    pilotStages: [['01', 'Déjà construit', 'Un parcours fonctionnel, local et testé sur 1 000 profils entièrement synthétiques.'], ['02', 'Déjà reconnu', 'Le prix de la meilleure solution pour les patients au hackathon AI for Health.'], ['03', 'À mesurer en pilote', 'La capacité à réduire la file accumulée, le temps de préparation et les reprises manuelles.']],
    responsibleEyebrow: 'CONCEPTION RESPONSABLE', responsibleTitle: 'Accélérer la préparation. Jamais la décision.',
    safeguards: [['○', 'Validation humaine', 'Aucun dossier n’est validé automatiquement.'], ['◇', 'Données synthétiques', 'Aucune donnée patient réelle dans le démonstrateur.'], ['?', 'Incertitude visible', 'Une information manquante ne devient jamais une conclusion favorable.'], ['◎', 'Calcul déterministe', 'Le cœur du parcours reste reproductible et utilisable localement.']],
    ctaTitle: 'Rattraper le retard sans raccourcir la vigilance.', ctaLead: 'Une solution née en 50 heures, récompensée pour sa valeur patient et conçue pour rendre de la capacité aux équipes.',
    openDemo: 'Ouvrir le démonstrateur', discoverHackathon: 'Découvrir le hackathon ↗', footerTagline: 'Rattraper la file. Préserver la décision.', repository: 'Voir sur GitHub', rights: 'Tous droits réservés',
  },
} as const

export function LandingPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const copy = content[locale]

  useEffect(() => { document.documentElement.lang = locale }, [locale])

  return (
    <main className="landing min-h-screen overflow-x-clip bg-background text-foreground">
      <a href="#contenu" className="skip-link">{copy.skip}</a>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="landing-shell flex items-center justify-between gap-3 py-3 sm:gap-5 sm:py-4">
        <Link href={ROUTES.landing} aria-label={copy.home} className="flex shrink-0 items-center"><img src="/ariane-logo.png" alt="Ariane" className="h-auto w-24 sm:w-44" /></Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex" aria-label={copy.navigation}><a href="#solution" className="hover:text-foreground">{copy.nav[0]}</a><a href="#impact" className="hover:text-foreground">{copy.nav[1]}</a><a href="#demo" className="hover:text-foreground">{copy.nav[2]}</a><a href="#pilote" className="hover:text-foreground">{copy.nav[3]}</a></nav>
        <div className="flex items-center gap-2">
          <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
            <SelectTrigger aria-label="Language" className="h-8 w-[3.25rem] gap-1 border-0 px-1 text-xs font-semibold text-muted-foreground shadow-none hover:text-foreground focus-visible:ring-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[4.5rem]">
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="fr">FR</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild size="sm" variant="outline" className="px-3"><a href="https://github.com/idris404/Ariane" target="_blank" rel="noreferrer">GitHub</a></Button>
          <Button asChild className="hidden md:inline-flex"><Link href={ROUTES.login}>{copy.open}</Link></Button>
        </div>
      </div>
      </header>

      <section id="contenu" aria-labelledby="hero-title" className="landing-shell grid items-center gap-12 pt-10 pb-20 lg:grid-cols-[0.92fr_1.08fr] lg:pt-16 lg:pb-28">
        <div className="flex flex-col items-start gap-6"><Badge variant="secondary" className="animate-landing-fade-up gap-2 border border-primary/20 bg-brand-soft px-4 py-2 text-sm font-semibold text-primary"><span aria-hidden="true">✦</span>{copy.award}</Badge><Badge variant="secondary" className="eyebrow animate-landing-fade-up max-w-full whitespace-normal text-left leading-5 [animation-delay:80ms]">{copy.heroEyebrow}</Badge><h1 id="hero-title" className="landing-display animate-landing-fade-up max-w-[12ch] [animation-delay:140ms]">{copy.heroTitle}<span className="block text-primary">{copy.heroAccent}</span></h1><p className="landing-lead animate-landing-fade-up max-w-[42ch] text-muted-foreground [animation-delay:200ms]">{copy.heroLead}</p><div className="animate-landing-fade-up flex flex-wrap gap-3 [animation-delay:260ms]"><Button asChild size="lg" className="min-h-12 text-base"><a href="#impact">{copy.impactCta}</a></Button><Button asChild size="lg" variant="outline" className="min-h-12 text-base"><a href="#demo">{copy.demoCta}</a></Button></div><p className="animate-landing-fade-up max-w-xl text-sm leading-6 text-muted-foreground [animation-delay:320ms]">{copy.boundary}</p></div>
        <div className="animate-landing-pop relative"><div aria-hidden="true" className="absolute -top-10 -right-12 h-44 w-44 rounded-[3rem] bg-secondary" /><Card className="landing-product relative overflow-hidden rounded-[2rem]"><CardContent className="p-3 sm:p-5"><figure><div className="overflow-hidden rounded-[1.25rem] bg-secondary"><img src="/showcase/signing-queue-full.png" alt={copy.imageAlt} className="w-full scale-[1.015]" /></div><figcaption className="flex flex-wrap items-center justify-between gap-3 px-2 pt-4 text-xs text-muted-foreground"><span>{copy.imageCaption}</span><Badge variant="secondary" className="bg-accent px-3 py-1 text-accent-foreground">○ {copy.humanValidation}</Badge></figcaption></figure></CardContent></Card></div>
      </section>

      <section className="border-y border-border bg-card" aria-label={copy.landmarks}><div className="mx-auto grid max-w-[76rem] gap-px bg-border sm:grid-cols-3">{copy.stats.map(([value, label]) => <Card key={value} role="article" className="rounded-none border-0 shadow-none"><CardContent className="px-6 py-9 sm:px-9 lg:px-12"><p className="landing-stat text-primary">{value}</p><p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{label}</p></CardContent></Card>)}</div></section>

      <section id="solution" className="landing-shell landing-section"><Reveal className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20"><div><Badge variant="secondary" className="eyebrow">{copy.problemEyebrow}</Badge><h2 className="landing-title mt-4 max-w-[13ch]">{copy.problemTitle}</h2><p className="landing-lead mt-6 max-w-[43ch] text-muted-foreground">{copy.problemLead}</p></div><div className="grid gap-4 sm:grid-cols-2">{copy.capabilities.map(([number, title, text], index) => <Reveal key={number} delay={index * 70} className="flex"><Card role="article" className="landing-card min-h-60 w-full"><CardContent className="flex h-full flex-col p-7 sm:p-8"><Badge variant="secondary" className="px-2.5 text-primary">{number}</Badge><h3 className="landing-subtitle mt-auto pt-12">{title}</h3><p className="mt-3 max-w-sm leading-7 text-muted-foreground">{text}</p></CardContent></Card></Reveal>)}</div></Reveal></section>

      <section id="impact" className="border-y border-border bg-secondary/45"><div className="landing-shell landing-section"><Reveal className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20"><Card className="rounded-[2rem] border-primary/15"><CardContent className="p-7 sm:p-10"><Badge variant="secondary" className="eyebrow">{copy.operationalTarget}</Badge><div className="mt-9 grid grid-cols-[1fr_auto_1fr] items-center gap-4"><div className="text-center"><p className="landing-impact-number text-muted-foreground">6</p><p className="mt-1 text-sm font-semibold">{copy.backlogMonths}</p></div><div className="landing-backlog-track" aria-hidden="true"><span /></div><div className="text-center"><p className="landing-impact-number text-primary">1</p><p className="mt-1 text-sm font-semibold">{copy.targetMonth}</p></div></div><Alert className="mt-8 border-warning/30 bg-warning-soft text-warning-foreground"><AlertDescription className="text-warning-foreground">{copy.projection}</AlertDescription></Alert></CardContent></Card><div><Badge variant="secondary" className="eyebrow">{copy.scaleEyebrow}</Badge><h2 className="landing-title mt-4">{copy.scaleTitle}</h2><p className="landing-lead mt-6 max-w-[44ch] text-muted-foreground">{copy.scaleLead}</p><ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">{copy.benefits.map((item) => <li key={item}><Card className="h-full shadow-none"><CardContent className="p-4">{item}</CardContent></Card></li>)}</ul></div></Reveal></div></section>

      <section id="demo" className="bg-[#202333] text-white"><div className="landing-shell landing-section grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20"><Reveal><Badge className="border border-white/10 bg-white/10 px-3 py-1 text-[#c8c9ff]">{copy.demoEyebrow}</Badge><h2 className="landing-title mt-4">{copy.demoTitle}</h2><p className="landing-lead mt-6 max-w-[40ch] text-white/70">{copy.demoLead}</p><ul className="mt-9 space-y-4 text-sm text-white/75">{copy.demoSteps.map((step, index) => <li key={step} className="flex gap-3"><span className="text-[#a7a8ff]">0{index + 1}</span>{step}</li>)}</ul></Reveal><Reveal delay={100}><BrandedVideo locale={locale} label={copy.videoLabel} poster="/showcase/dashboard.jpg" src="/showcase/demo-ariane.mp4" /></Reveal></div></section>

      <section className="landing-shell landing-section"><Reveal className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20"><div><Badge variant="secondary" className="eyebrow">{copy.resultEyebrow}</Badge><h2 className="landing-title mt-4">{copy.resultTitle}</h2><p className="landing-lead mt-6 max-w-[44ch] text-muted-foreground">{copy.resultLead}</p><Alert className="mt-5 border-warning/30 bg-warning-soft text-warning-foreground"><AlertDescription className="text-warning-foreground">{copy.resultWarning}</AlertDescription></Alert></div><Card className="overflow-hidden rounded-[2rem]"><CardContent className="p-8 sm:p-10"><div className="flex items-end justify-between gap-5 border-b border-border pb-8"><div><p className="landing-impact-number text-primary">714</p><p className="mt-2 text-sm text-muted-foreground">{copy.toValidate}</p></div><div className="text-right"><p className="text-4xl font-semibold">286</p><p className="mt-2 text-sm text-muted-foreground">{copy.toReview}</p></div></div><div className="mt-8 flex h-5 overflow-hidden rounded-full" role="img" aria-label={copy.resultAria}><span className="landing-progress block w-[71.4%] origin-left bg-primary" /><span className="landing-progress block w-[28.6%] origin-left bg-warning [transition-delay:180ms]" /></div></CardContent></Card></Reveal></section>

      <section id="architecture" className="border-y border-border bg-secondary/45"><div className="landing-shell landing-section"><Reveal className="max-w-3xl"><Badge variant="secondary" className="eyebrow">{copy.architectureEyebrow}</Badge><h2 className="landing-title mt-4">{copy.architectureTitle}</h2><p className="landing-lead mt-6 text-muted-foreground">{copy.architectureLead}</p></Reveal><div className="mt-12 grid gap-3 lg:grid-cols-4">{copy.architecture.map(([title, text], index) => <Reveal key={title} delay={index * 80} className="flex"><Card role="article" className="landing-card relative w-full"><CardContent className="p-6"><Badge variant="secondary" className="text-primary">0{index + 1}</Badge><h3 className="landing-subtitle mt-8">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>{index < copy.architecture.length - 1 ? <span aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-primary lg:flex">→</span> : null}</CardContent></Card></Reveal>)}</div></div></section>

      <section id="pilote" className="landing-shell landing-section"><Reveal className="grid gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:gap-20"><div><Badge variant="secondary" className="eyebrow">{copy.pilotEyebrow}</Badge><h2 className="landing-title mt-4">{copy.pilotTitle}</h2><p className="landing-lead mt-6 max-w-[43ch] text-muted-foreground">{copy.pilotLead}</p><Button asChild variant="outline" size="lg" className="mt-8"><a href="https://github.com/idris404/Ariane/blob/main/docs/PILOT.md" target="_blank" rel="noreferrer">{copy.pilotCta}</a></Button></div><div className="grid gap-4">{copy.pilotStages.map(([number, title, text], index) => <Reveal key={number} delay={index * 70}><Card role="article" className="landing-card"><CardContent className="grid gap-4 p-6 sm:grid-cols-[auto_1fr] sm:gap-6 sm:p-7"><Badge variant="secondary" className="h-fit text-primary">{number}</Badge><div><h3 className="landing-subtitle">{title}</h3><p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{text}</p></div></CardContent></Card></Reveal>)}</div></Reveal></section>

      <section className="landing-shell landing-section"><Reveal><Card className="rounded-[2rem] border-0 bg-accent shadow-none"><CardContent className="grid gap-12 p-8 sm:p-12 lg:grid-cols-[0.72fr_1.28fr] lg:p-16"><div><Badge variant="secondary" className="bg-white/70 text-accent-foreground">{copy.responsibleEyebrow}</Badge><h2 className="landing-title mt-4">{copy.responsibleTitle}</h2></div><div className="grid gap-5 sm:grid-cols-2">{copy.safeguards.map(([symbol, title, text]) => <Card key={title} role="article" className="border-0 bg-white/70 shadow-none"><CardContent className="p-5"><Badge variant="secondary" aria-hidden="true" className="text-accent-foreground">{symbol}</Badge><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></CardContent></Card>)}</div></CardContent></Card></Reveal></section>

      <section className="landing-shell pb-[clamp(4rem,2.6rem+6vw,7.5rem)]"><Reveal><Card className="rounded-[2.5rem] border-0 bg-primary text-white shadow-none"><CardContent className="px-6 py-16 text-center sm:px-10 sm:py-24"><Badge variant="outline" className="border-white/30 bg-primary-hover text-white">AI for Health · Paris</Badge><h2 className="landing-display mx-auto mt-5 max-w-[16ch]">{copy.ctaTitle}</h2><p className="landing-lead mx-auto mt-6 max-w-[42ch] text-white">{copy.ctaLead}</p><div className="mt-9 flex flex-wrap justify-center gap-3"><Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-secondary"><Link href={ROUTES.login}>{copy.openDemo}</Link></Button><Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"><a href="https://hackathons-artefactadoptai.agorize.com/fr/challenges/hackathon-adopt-ai-for-health?lang=fr" target="_blank" rel="noreferrer">{copy.discoverHackathon}</a></Button></div></CardContent></Card></Reveal></section>

      <footer className="landing-shell flex flex-col gap-8 border-t border-border py-12 lg:flex-row lg:items-center lg:justify-between"><div><img src="/ariane-logo.png" alt="Ariane" className="h-auto w-36" /><p className="mt-3 text-sm text-muted-foreground">{copy.footerTagline}</p></div><div className="flex flex-wrap gap-3"><Button asChild variant="outline"><a href="https://github.com/idris404/Ariane" target="_blank" rel="noreferrer">{copy.repository}</a></Button><Button asChild><Link href={ROUTES.login}>{copy.open}</Link></Button></div><p className="text-xs text-muted-foreground">© 2026 Ariane · {copy.rights}</p></footer>
    </main>
  )
}
