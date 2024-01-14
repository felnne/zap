import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { AccessRestriction, Licence as LicenceT } from '@/types/app'
import type { Constraint } from '@/types/iso'
import Licence from '@/sections/Licence.vue'

import licencesData from '@/data/licences.json'

const openAccessRestriction: AccessRestriction = {
  slug: 'anonymous',
  restriction: 'unrestricted',
  label: 'Open Access (Anonymous)',
  permissions: [],
}

const closedAccessRestriction: AccessRestriction = {
  slug: 'nerc',
  restriction: 'restricted',
  label: 'Closed Access (NERC)',
  permissions: [],
}

describe('Licence', () => {
  it('renders licence from open choice', async () => {
    const expectedLicence: LicenceT = licencesData['licences']['OGL_UK_3_0']
    const expectedConstraint: Constraint = {
      type: 'usage',
      restriction_code: 'license',
      statement: expectedLicence.statement,
      href: expectedLicence.url,
    }

    const wrapper = mount(Licence, {
      props: {
        accessRestriction: openAccessRestriction,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // don't need to wait for filter as initial licence happens to be open

    expect(wrapper.find('pre').text()).toBe(JSON.stringify(expectedConstraint, null, 2))
  })

  it('renders licence from closed choice', async () => {
    const expectedLicence: LicenceT = licencesData['licences']['X_FAKE_CLOSED']
    const expectedConstraint: Constraint = {
      type: 'usage',
      restriction_code: 'license',
      statement: expectedLicence.statement,
      href: expectedLicence.url,
    }

    const wrapper = mount(Licence, {
      props: {
        accessRestriction: closedAccessRestriction,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // wait for licences to be filtered based on access restriction
    await wrapper.vm.$nextTick()

    expect(wrapper.find('pre').text()).toBe(JSON.stringify(expectedConstraint, null, 2))
  })

  it('updates licence from choice', async () => {
    const expectedLicenceName = 'Creative Commons Attribution 4.0 International'

    const wrapper = mount(Licence, {
      props: {
        accessRestriction: openAccessRestriction,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set radio input with id 'licence-CC_BY_4_0' to checked
    await wrapper.find('input#licence-CC_BY_4_0').setValue()

    expect(wrapper.find('pre').text()).toContain(expectedLicenceName)
  })

  it('updates licence from restriction', async () => {
    const expectedInitialLicenceHref =
      'http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/'
    const expectedUpdatedLicenceHref = 'http://www.example.com'

    const wrapper = mount(Licence, {
      props: {
        accessRestriction: openAccessRestriction,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('pre').text()).toContain(expectedInitialLicenceHref)

    // update prop to closed access restriction
    await wrapper.setProps({ accessRestriction: closedAccessRestriction })

    expect(wrapper.find('pre').text()).toContain(expectedUpdatedLicenceHref)
  })
})
