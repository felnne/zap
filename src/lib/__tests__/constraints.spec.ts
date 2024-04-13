import { describe, it, expect } from 'vitest'

import {
  createAccessConstraint,
  createUsageConstraint,
  decodeAccessConstraintPermissions,
} from '@/lib/constraints'
import type { AccessRestriction, Licence } from '@/types/app'

describe('createAccessConstraint', () => {
  it('builds an access constraint with permissions', () => {
    const restriction: AccessRestriction = {
      slug: 'other',
      restriction: 'access',
      label: 'Other access restriction',
      permissions: [
        {
          scheme: 'foo',
          schemeVersion: '1.0',
          directoryId: 'xxx',
          objectId: 'yyy',
        },
      ],
    }
    const expectedConstraint = {
      type: 'access',
      restriction_code: restriction.restriction,
      statement: restriction.label,
      href: `#${encodeURIComponent(JSON.stringify(restriction.permissions))}`,
    }

    expect(createAccessConstraint(restriction)).toStrictEqual(expectedConstraint)
  })

  it('builds an access constraint with no permissions', () => {
    const restriction: AccessRestriction = {
      slug: 'other',
      restriction: 'access',
      label: 'Other access restriction',
      permissions: [],
    }
    const expectedConstraint = {
      type: 'access',
      restriction_code: restriction.restriction,
      statement: restriction.label,
      href: `#${encodeURIComponent(JSON.stringify(restriction.permissions))}`,
    }

    expect(createAccessConstraint(restriction)).toStrictEqual(expectedConstraint)
  })
})

describe('createUsageConstraint', () => {
  it('builds a licence usage constraint', () => {
    const licence: Licence = {
      slug: 'OGL_UK_3_0',
      name: '(UK) Open Government Licence v3.0',
      url: 'http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
      statement:
        'This information is licensed under the Open Government Licence v3.0. To view this licence, visit http://www.nationalarchives.gov.uk/doc/open-government-licence/.',
      open: true,
    }
    const expectedConstraint = {
      type: 'usage',
      restriction_code: 'license',
      statement: licence.statement,
      href: licence.url,
    }

    expect(createUsageConstraint(licence)).toStrictEqual(expectedConstraint)
  })
})

describe('decodeAccessConstraintPermissions', () => {
  it('decodes permissions from a URL fragment', () => {
    const permissions = [
      {
        scheme: 'foo',
        schemeVersion: '1.0',
        directoryId: 'xxx',
        objectId: 'yyy',
      },
    ]
    const input = `#${encodeURIComponent(JSON.stringify(permissions))}`

    expect(decodeAccessConstraintPermissions(input)).toStrictEqual(permissions)
  })
})
