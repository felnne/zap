import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { DistributionOption, PointOfContact as IsoContact } from '@/types/iso'
import { createOrgPointOfContact } from '@/lib/contacts'
import { getOrganisation, getService, getServiceSlugs } from '@/lib/data'
import { createServiceDistributionOption } from '@/lib/distribution'

import Services from '@/components/sections/elements/Services.vue'

describe('Services', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders properly', async () => {
    const serviceSlugs = getServiceSlugs()

    const wrapper = mount(Services, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    serviceSlugs.every((service) =>
      expect(wrapper.find(`input#service-${service}-selection`).exists()).toBeTruthy()
    )
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})

describe('Services [Integration]', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits distributionOptions when service enabled', async () => {
    const expectedServiceSlug = 'fake_service'
    const expectedService = getService(expectedServiceSlug)
    const expectedEndpoint = 'https://www.example.com'
    const expectedDistributor: IsoContact = createOrgPointOfContact(
      getOrganisation('bas_magic'),
      'distributor'
    )

    const expectedDistributionOptions = [
      createServiceDistributionOption(expectedService, expectedEndpoint, expectedDistributor),
    ]

    const wrapper = mount(Services, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // enable service in child component
    await wrapper.find(`input#service-${expectedServiceSlug}-selection`).setValue()

    // set endpoint (needs to be after it's enabled) in child component
    await wrapper.find(`input#service-${expectedServiceSlug}-endpoint`).setValue(expectedEndpoint)

    const emittedIsoDistOptionsServices: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistOptionsServices'
    )
    expect(emittedIsoDistOptionsServices).toBeTruthy()
    if (emittedIsoDistOptionsServices) {
      expect(emittedIsoDistOptionsServices[0][0]).toEqual(expectedDistributionOptions)
    }
  })

  it('emits distributionOptions when service disabled', async () => {
    const expectedServiceSlug = 'fake_service'
    const expectedEndpoint = 'https://www.example.com'
    const expectedDistributionOptions: DistributionOption[] = []

    const wrapper = mount(Services, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // enable service in child component
    await wrapper.find(`input#service-${expectedServiceSlug}-selection`).setValue()

    // set endpoint (needs to be after it's enabled and to trigger emit) in child component
    await wrapper.find(`input#service-${expectedServiceSlug}-endpoint`).setValue(expectedEndpoint)

    // disable service in child component
    await wrapper.find(`input#service-${expectedServiceSlug}-selection`).setValue(false)

    const emittedIsoDistOptionsServices: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistOptionsServices'
    )
    expect(emittedIsoDistOptionsServices).toBeTruthy()
    if (emittedIsoDistOptionsServices) {
      expect(emittedIsoDistOptionsServices[1][0]).toEqual(expectedDistributionOptions)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
