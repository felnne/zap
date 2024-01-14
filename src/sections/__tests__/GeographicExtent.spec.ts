import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { WellKnownExtent } from '@/types/app'
import type { Extent } from '@/types/iso'
import GeographicExtent from '@/sections/GeographicExtent.vue'

import extentsData from '@/data/extents.json'

describe('GeographicExtent', () => {
  it('renders extent from choice', async () => {
    const expectedWKE: WellKnownExtent = extentsData['geographic']['antarctica']
    const expectedExtent: Extent = {
      geographic: expectedWKE.extent.geographic,
    }

    const wrapper = mount(GeographicExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('pre').text()).toBe(JSON.stringify(expectedExtent, null, 2))
  })

  it('updates extent from choice', async () => {
    const expectedValueInExtent = -50

    const wrapper = mount(GeographicExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set radio input with id 'extent-sub_antarctica' to checked
    await wrapper.find('input#extent-sub_antarctica').setValue()

    expect(wrapper.find('pre').text()).toContain(expectedValueInExtent)
  })
})
