import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { PointOfContact as IsoContact } from '@/types/iso'
import { createOrgPointOfContact } from '@/lib/contacts'
import { getOrganisation, getService } from '@/lib/data'
import { createServiceDistributionOption } from '@/lib/distribution'

import Service from '@/components/sections/elements/Service.vue'

const expectedServiceSlug = 'fake_service'
const expectedService = getService(expectedServiceSlug)
const expectedDistributor: IsoContact = createOrgPointOfContact(
  getOrganisation('bas_magic'),
  'distributor'
)

describe('Service', () => {
  it('renders output when selected', async () => {
    const expectedEndpoint = 'https://www.example.com'

    const wrapper = mount(Service, {
      props: { slug: expectedServiceSlug },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // enable service
    await wrapper.find(`input#service-${expectedServiceSlug}-selection`).setValue()

    // set endpoint (needs to be after it's enabled)
    await wrapper.find(`input#service-${expectedServiceSlug}-endpoint`).setValue(expectedEndpoint)

    expect(wrapper.find('pre').text()).toContain(expectedEndpoint)
  })

  it('has a disabled value input when not enabled', async () => {
    const wrapper = mount(Service, {
      props: { slug: expectedServiceSlug },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const inputElement = wrapper.find(`input#service-${expectedServiceSlug}-endpoint`)
    expect(inputElement.attributes().disabled).toBe('')
  })

  it('emits when selected and endpoint set', async () => {
    const expectedEndpoint = 'https://www.example.com'
    const expectedDistributionOption = createServiceDistributionOption(
      expectedService,
      expectedEndpoint,
      expectedDistributor
    )

    const wrapper = mount(Service, {
      props: { slug: expectedServiceSlug },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // enable service
    await wrapper.find(`input#service-${expectedServiceSlug}-selection`).setValue()

    // set endpoint (needs to be after it's enabled)
    await wrapper.find(`input#service-${expectedServiceSlug}-endpoint`).setValue(expectedEndpoint)

    const emittedIsoDistributionOption: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistributionOption'
    )
    expect(emittedIsoDistributionOption).toBeTruthy()
    if (emittedIsoDistributionOption) {
      expect(emittedIsoDistributionOption[0][0]).toEqual(expectedDistributionOption)
    }
  })

  it('emits when deselected', async () => {
    const wrapper = mount(Service, {
      props: { slug: expectedServiceSlug },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // enable service
    await wrapper.find(`input#service-${expectedServiceSlug}-selection`).setValue()

    // disable service
    await wrapper.find(`input#service-${expectedServiceSlug}-selection`).setValue(false)

    const emittedIsoDistOptionsServices: unknown[][] | undefined =
      wrapper.emitted('update:selected')
    expect(emittedIsoDistOptionsServices).toBeTruthy()
    if (emittedIsoDistOptionsServices) {
      expect(emittedIsoDistOptionsServices[1][0]).toEqual(false)
    }
  })
})
