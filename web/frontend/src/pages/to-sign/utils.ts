import { z } from 'zod'

import { PATIENT_ALREADY_SIGNED_CODE, TO_SIGN_ERRORS } from '../../constants/to-sign'
import { ApiError } from '../../shared/utils/api'

export function queueErrorMessage(error: unknown): string {
  return error instanceof z.ZodError ? TO_SIGN_ERRORS.invalid : TO_SIGN_ERRORS.queue
}

export function signErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.detail === PATIENT_ALREADY_SIGNED_CODE) {
    return TO_SIGN_ERRORS.alreadySigned
  }
  return TO_SIGN_ERRORS.sign
}
