import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { AccessRestriction } from '@/types/app'
import { getLicence } from '@/lib/data'
import { createUsageConstraint } from '@/lib/constraints'
import Licence from '@/components/sections/elements/Licence.vue'

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
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)

    // mock dark-mode detection (`matches` should be false to indicate light mode)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('renders and emits licence from open choice', async () => {
    const expectedLicence = getLicence('OGL_UK_3_0')
    const expectedConstraint = createUsageConstraint(expectedLicence)

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

    expect(wrapper.find('img#licence-img').attributes('src')).toContain(expectedLicence.img_light)

    expect(wrapper.find('pre').text()).toBe(JSON.stringify(expectedConstraint, null, 2))

    await wrapper.vm.$nextTick()

    const emittedLicence: unknown[][] | undefined = wrapper.emitted('update:licence')
    expect(emittedLicence).toBeTruthy()
    if (emittedLicence && emittedLicence[0]) {
      expect(emittedLicence[0][0]).toEqual(expectedLicence)
    }

    const emittedIsoLicence: unknown[][] | undefined = wrapper.emitted('update:isoLicence')
    expect(emittedIsoLicence).toBeTruthy()
    if (emittedIsoLicence && emittedIsoLicence[0]) {
      expect(emittedIsoLicence[0][0]).toEqual(expectedConstraint)
    }
  })

  it('renders and emits licence from closed choice', async () => {
    const expectedLicence = getLicence('X_OPERATIONS_MAPPING_1')
    const expectedConstraint = createUsageConstraint(expectedLicence)

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
    if (emittedLicence && emittedLicence[0]) {
      expect(emittedLicence[0][0]).toEqual(expectedLicence)
    }

    const emittedIsoLicence: unknown[][] | undefined = wrapper.emitted('update:isoLicence')
    expect(emittedIsoLicence).toBeTruthy()
    if (emittedIsoLicence && emittedIsoLicence[0]) {
      expect(emittedIsoLicence[0][0]).toEqual(expectedConstraint)
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
    if (emittedLicence && emittedLicence[1]) {
      expect(emittedLicence[1][0]).toEqual(expectedLicence)
    }
  })

  it('updates licence from restriction', async () => {
    const expectedInitialLicence = getLicence('OGL_UK_3_0')
    const expectedUpdatedLicence = getLicence('X_OPERATIONS_MAPPING_1')
    const expectedInitialConstraint = createUsageConstraint(expectedInitialLicence)
    const expectedUpdatedConstraint = createUsageConstraint(expectedUpdatedLicence)

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
    if (emittedLicence && emittedLicence[0]) {
      expect(emittedLicence[0][0]).toEqual(expectedInitialLicence)
    }
    const emittedIsoLicence: unknown[][] | undefined = wrapper.emitted('update:isoLicence')
    expect(emittedIsoLicence).toBeTruthy()
    if (emittedIsoLicence && emittedIsoLicence[0]) {
      expect(emittedIsoLicence[0][0]).toEqual(expectedInitialConstraint)
    }

    // update prop to closed access restriction
    await wrapper.setProps({ accessRestriction: closedAccessRestriction })

    expect(wrapper.find('pre').text()).toContain(expectedUpdatedLicence.url)
    if (emittedLicence && emittedLicence[1]) {
      expect(emittedLicence[1][0]).toEqual(expectedUpdatedLicence)
    }
    if (emittedIsoLicence && emittedIsoLicence[1]) {
      expect(emittedIsoLicence[1][0]).toEqual(expectedUpdatedConstraint)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)

    vi.restoreAllMocks()
  })
})
