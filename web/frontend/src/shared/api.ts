import { env } from '../core/env'

export class SessionRequiredError extends Error {}

export class ApiRequestError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`API ${status}`)
    this.status = status
  }
}

export class InvalidResponseError extends Error {}

export async function readJson(path: string): Promise<unknown> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, { credentials: 'include' })
  if (response.status === 401) {
    throw new SessionRequiredError()
  }
  if (!response.ok) {
    throw new ApiRequestError(response.status)
  }
  return response.json() as Promise<unknown>
}
