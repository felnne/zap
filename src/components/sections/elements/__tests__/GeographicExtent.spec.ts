import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { GeographicExtent as GeographicExtentT, ReferenceSystemInfo } from '@/types/iso'
import { getExtent, getProjection } from '@/lib/data'
import GeographicExtent from '@/components/sections/elements/GeographicExtent.vue'

vi.mock('@/lib/esriNoTest', () => ({
  initExtentMap: vi.fn().mockReturnValue({ mock: true }),
  loadCssTheme: vi.fn().mockReturnValue({ mock: true }),
}))

describe('GeographicExtent', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits value when mounted', async () => {
    const wke = getExtent('antarctica')
    const expectedGeographicExtent: GeographicExtentT = wke.extent.geographic

    const wrapper = mount(GeographicExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const emittedIsoExtentGeographic: unknown[][] | undefined = wrapper.emitted(
      'update:isoExtentGeographic'
    )
    expect(emittedIsoExtentGeographic).toBeTruthy()
    if (emittedIsoExtentGeographic) {
      expect(emittedIsoExtentGeographic[0][0]).toEqual(expectedGeographicExtent)
    }
  })

  it('emits value when updated', async () => {
    const initialWke = getExtent('antarctica')
    const expectedInitialIsoExtentGeographic: GeographicExtentT = initialWke.extent.geographic

    const updatedWke = getExtent('sub_antarctica')
    const expectedUpdatedIsoExtentGeographic: GeographicExtentT = updatedWke.extent.geographic

    const wrapper = mount(GeographicExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // initial value
    const emittedIsoExtentGeographic: unknown[][] | undefined = wrapper.emitted(
      'update:isoExtentGeographic'
    )
    expect(emittedIsoExtentGeographic).toBeTruthy()
    if (emittedIsoExtentGeographic) {
      expect(emittedIsoExtentGeographic[0][0]).toEqual(expectedInitialIsoExtentGeographic)
    }

    // set radio input with id 'extent-geo-sub_antarctica' to checked (well known extent)
    await wrapper.find('input#extent-geo-sub_antarctica').setValue()

    await wrapper.vm.$nextTick()

    // updated value
    if (emittedIsoExtentGeographic) {
      expect(emittedIsoExtentGeographic[1][0]).toEqual(expectedUpdatedIsoExtentGeographic)
    }
  })

  it('renders extent from well known extent choice', async () => {
    const wke = getExtent('antarctica')
    const projection = getProjection(wke.projectionSlug)

    const expectedExtentGeographic: GeographicExtentT = wke.extent.geographic
    const expectedCRS: ReferenceSystemInfo = {
      authority: projection.authority,
      code: projection.code,
      version: projection.version,
    }

    const wrapper = mount(GeographicExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('#extent-geographic pre').text()).toBe(
      JSON.stringify(expectedExtentGeographic, null, 2)
    )
    expect(wrapper.find('#spatial-crs pre').text()).toBe(JSON.stringify(expectedCRS, null, 2))
  })

  it('updates extent from well known extent choice', async () => {
    const expectedValueInExtent = -50

    const wrapper = mount(GeographicExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set radio input with id 'extent-geo-sub_antarctica' to checked
    await wrapper.find('input#extent-geo-sub_antarctica').setValue()

    expect(wrapper.find('pre').text()).toContain(expectedValueInExtent)
  })

  it('renders extent from custom extent choice', async () => {
    const expectedValueInExtent = 100

    const wrapper = mount(GeographicExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set radio input with id 'extent-geo-custom' to checked
    await wrapper.find('input#extent-geo-custom').setValue()

    await wrapper.find('input#bbox-west-long').setValue(expectedValueInExtent)

    expect(wrapper.find('pre').text()).toContain(expectedValueInExtent)
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
