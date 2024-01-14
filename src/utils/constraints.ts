import type { AccessPermission, AccessRestriction, Licence } from '@/types/app'
import type { Constraint } from '@/types/iso'

export const createAccessConstraint = (restriction: AccessRestriction): Constraint => {
  return {
    type: 'access',
    restriction_code: restriction.restriction ?? '',
    statement: restriction.label ?? '',
    href: `#${encodeURIComponent(JSON.stringify(restriction.permissions ?? []))}`,
  }
}

export const createUsageConstraint = (licence: Licence): Constraint => {
  return {
    type: 'usage',
    restriction_code: 'license',
    statement: licence.statement,
    href: licence.url,
  }
}

export const decodeAccessConstraintPermissions = (permissions: string): AccessPermission[] => {
  // remove leading URL fragment
  permissions = permissions.replace(/^#/, '')
  return JSON.parse(decodeURIComponent(permissions))
}
