import type { ContactInput } from '@/lib/validation'

/**
 * Folds the optional fit-call fields into the stored message, so the admin
 * inbox and notification email show them without a schema change.
 */
export function composeInquiryMessage(input: Pick<ContactInput, 'message' | 'firm' | 'website' | 'discipline'>) {
  const details = [
    input.firm && `Firm: ${input.firm}`,
    input.discipline && `Discipline: ${input.discipline}`,
    input.website && `Website: ${input.website}`,
  ].filter(Boolean)
  if (details.length === 0) return input.message
  return `${details.join('\n')}\n\n${input.message}`.slice(0, 6000)
}
