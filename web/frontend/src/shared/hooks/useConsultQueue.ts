import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { consultKeys } from '../../constants/to-consult'
import { fetchConsultQueue } from '../utils/consult'
import { useImportedData } from './useImportedData'

// Partagé : la page « À consulter » lit les cas, la barre latérale n'en lit que le total.
export function useConsultQueue(page: number, pageSize: number) {
  const isImported = useImportedData()
  return useQuery({
    queryKey: consultKeys.queue(page, pageSize),
    queryFn: () => fetchConsultQueue(page, pageSize),
    placeholderData: keepPreviousData,
    enabled: isImported,
  })
}
