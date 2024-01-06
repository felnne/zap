import { describe, it, expect } from 'vitest'

import { createConstraint } from '@/utils/constraints'

describe('createConstraint', () => {
  it('builds a licence usage constraint', () => {
    const licence = {
      slug: 'OGL_UK_3_0',
      name: '(UK) Open Government Licence v3.0',
      url: 'http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
      statement:
        'This information is licensed under the Open Government Licence v3.0. To view this licence, visit http://www.nationalarchives.gov.uk/doc/open-government-licence/.'
    }
    const expectedConstraint = {
      type: 'usage',
      restriction_code: 'license',
      statement: licence.statement,
      href: licence.url
    }

    expect(createConstraint(licence)).toStrictEqual(expectedConstraint)
  })
})
