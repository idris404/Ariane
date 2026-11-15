import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { consultKeys } from '../../constants/to-consult'
import { fetchConsultQueue } from '../utils/consult'

// Partagé : la page « À consulter » lit les cas, la barre latérale n'en lit que le total.
export function useConsultQueue(page: number, pageSize: number) {
  return useQuery({
    queryKey: consultKeys.queue(page, pageSize),
    queryFn: () => fetchConsultQueue(page, pageSize),
    placeholderData: keepPreviousData,
  })
}
