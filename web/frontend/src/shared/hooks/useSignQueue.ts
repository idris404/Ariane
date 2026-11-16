import { useQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '../../constants/api'
import { signKeys } from '../../constants/to-sign'
import { signQueueSchema, type SignQueue } from '../schemas/signQueue'
import { apiFetch } from '../utils/api'
import { useImportedData } from './useImportedData'

async function fetchSignQueue(): Promise<SignQueue> {
  const response = await apiFetch(API_ENDPOINTS.signQueue)
  return signQueueSchema.parse(await response.json())
}

// Partagé : la barre latérale affiche `remaining`, la page « À signer » affiche les cas.
export function useSignQueue() {
  const isImported = useImportedData()
  return useQuery({ queryKey: signKeys.queue, queryFn: fetchSignQueue, enabled: isImported })
}
