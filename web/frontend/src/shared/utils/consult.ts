import { API_ENDPOINTS } from '../../constants/api'
import { consultQueueSchema, type ConsultQueue } from '../schemas/consultQueue'
import { apiFetch } from './api'

// Une page de la file « À consulter ». La réponse est validée : un écart de contrat est une erreur.
export async function fetchConsultQueue(page: number, pageSize: number): Promise<ConsultQueue> {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
  const response = await apiFetch(`${API_ENDPOINTS.consultQueue}?${params.toString()}`)
  return consultQueueSchema.parse(await response.json())
}
