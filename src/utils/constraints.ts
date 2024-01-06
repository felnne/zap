import type { Licence } from '@/types/app'
import type { Constraint } from '@/types/iso'

  export const createConstraint = (licence: Licence): Constraint => {
  return {
    type: 'usage',
    restriction_code: 'license',
    statement: licence.statement,
    href: licence.url
  }
}
