import { useParams } from 'next/navigation'

export function useFicheId(): string | undefined {
  const value = useParams<{ id: string | string[] }>().id
  return Array.isArray(value) ? value[0] : value
}
