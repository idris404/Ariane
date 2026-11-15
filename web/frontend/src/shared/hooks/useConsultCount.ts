import { CONSULT_COUNT_PAGE_SIZE, FIRST_PAGE } from '../../constants/to-consult'
import { useConsultQueue } from './useConsultQueue'

// Nombre de cas à consulter pour la barre latérale ; `undefined` tant qu'il n'est pas connu.
export function useConsultCount(): number | undefined {
  return useConsultQueue(FIRST_PAGE, CONSULT_COUNT_PAGE_SIZE).data?.total
}
