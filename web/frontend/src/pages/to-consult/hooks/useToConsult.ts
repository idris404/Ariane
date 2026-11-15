import { useMemo, useState } from 'react'

import { CONSULT_PAGE_SIZE, FIRST_PAGE } from '../../../constants/to-consult'
import { useConsultQueue } from '../../../shared/hooks/useConsultQueue'
import { toPatientCase } from '../../../shared/utils/cases'
import { consultErrorMessage } from '../utils'

export function useToConsult() {
  const [page, setPage] = useState(FIRST_PAGE)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [today] = useState(() => new Date())
  const queue = useConsultQueue(page, CONSULT_PAGE_SIZE)

  const cases = useMemo(
    () => (queue.data?.items ?? []).map((item) => toPatientCase(item, today)),
    [queue.data, today],
  )
  const total = queue.data?.total ?? 0
  const pageCount = Math.max(FIRST_PAGE, Math.ceil(total / CONSULT_PAGE_SIZE))

  function goToPage(next: number) {
    setPage(next)
    setExpandedId(null)
  }

  return {
    cases,
    total,
    from: total === 0 ? 0 : (page - 1) * CONSULT_PAGE_SIZE + 1,
    to: Math.min(page * CONSULT_PAGE_SIZE, total),
    isLoading: queue.isLoading,
    errorMessage: queue.isError ? consultErrorMessage(queue.error) : null,
    expandedId,
    onToggle: (id: string) => setExpandedId((current) => (current === id ? null : id)),
    canPrevious: page > FIRST_PAGE,
    canNext: page < pageCount,
    onPrevious: () => goToPage(Math.max(FIRST_PAGE, page - 1)),
    onNext: () => goToPage(Math.min(pageCount, page + 1)),
  }
}
