import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { AccessRestriction } from '@/types/app'
import type { Constraint } from '@/types/iso'
import { getLicence } from '@/utils/data'
import Licence from '@/sections/Licence.vue'

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
  it('renders and emits licence from open choice', async () => {
    const expectedLicence = getLicence('OGL_UK_3_0')
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

    await wrapper.vm.$nextTick()

    const emittedLicence: unknown[][] | undefined = wrapper.emitted('update:licence')
    expect(emittedLicence).toBeTruthy()
    if (emittedLicence) {
      expect(emittedLicence[0][0]).toEqual(expectedLicence)
    }
  })

  it('renders and emits licence from closed choice', async () => {
    const expectedLicence = getLicence('X_FAKE_CLOSED')
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

    const emittedLicence: unknown[][] | undefined = wrapper.emitted('update:licence')
    expect(emittedLicence).toBeTruthy()
    if (emittedLicence) {
      expect(emittedLicence[0][0]).toEqual(expectedLicence)
    }
  })

  it('updates licence from choice', async () => {
    const expectedLicence = getLicence('CC_BY_4_0')

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

    expect(wrapper.find('pre').text()).toContain(expectedLicence.name)

    // check second emit for licence update
    const emittedLicence: unknown[][] | undefined = wrapper.emitted('update:licence')
    expect(emittedLicence).toBeTruthy()
    if (emittedLicence) {
      expect(emittedLicence[1][0]).toEqual(expectedLicence)
    }
  })

  it('updates licence from restriction', async () => {
    const expectedInitialLicence = getLicence('OGL_UK_3_0')
    const expectedUpdatedLicence = getLicence('X_FAKE_CLOSED')

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

    expect(wrapper.find('pre').text()).toContain(expectedInitialLicence.url)

    const emittedLicence: unknown[][] | undefined = wrapper.emitted('update:licence')
    expect(emittedLicence).toBeTruthy()
    if (emittedLicence) {
      expect(emittedLicence[0][0]).toEqual(expectedInitialLicence)
    }

    // update prop to closed access restriction
    await wrapper.setProps({ accessRestriction: closedAccessRestriction })

    expect(wrapper.find('pre').text()).toContain(expectedUpdatedLicence.url)
    if (emittedLicence) {
      expect(emittedLicence[1][0]).toEqual(expectedUpdatedLicence)
    }
  })
})
