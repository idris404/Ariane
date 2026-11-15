import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { MOCK_IMPORT, PERCENT_MAX } from '../../../constants/import'
import { ROUTES } from '../../../constants/routes'
import { analysisProgress } from '../utils'

// Analyse simulée des patients détectés : fait avancer la progression pendant `analysis.durationMs`,
// puis redirige vers la page « à signer ». Démonté (fenêtre fermée), il annule l'analyse sans
// redirection.
export function useImportAnalysis() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startedAt = performance.now()
    let frame = 0

    function tick() {
      const elapsed = performance.now() - startedAt
      setProgress(analysisProgress(elapsed))
      if (elapsed >= MOCK_IMPORT.analysis.durationMs) {
        navigate(ROUTES.toSign)
        return
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [navigate])

  const total = MOCK_IMPORT.detectedPatients
  return {
    percent: Math.round(progress * PERCENT_MAX),
    processed: Math.floor(progress * total),
    total,
  }
}
