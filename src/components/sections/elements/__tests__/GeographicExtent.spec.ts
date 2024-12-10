import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { Extent, ReferenceSystemInfo } from '@/types/iso'
import { getExtent, getProjection } from '@/lib/data'
import GeographicExtent from '@/components/sections/elements/GeographicExtent.vue'

const expectedIsoExtentIdentifier = 'bounding'

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
    const expectedExtent: Extent = {
      identifier: expectedIsoExtentIdentifier,
      geographic: wke.extent.geographic,
    }

    const wrapper = mount(GeographicExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const emittedIsoExtent: unknown[][] | undefined = wrapper.emitted('update:isoExtent')
    expect(emittedIsoExtent).toBeTruthy()
    if (emittedIsoExtent) {
      expect(emittedIsoExtent[0][0]).toEqual(expectedExtent)
    }
  })

  it('emits value when updated', async () => {
    const initialWke = getExtent('antarctica')
    const expectedInitialIsoExtent: Extent = {
      identifier: expectedIsoExtentIdentifier,
      geographic: initialWke.extent.geographic,
    }

    const updatedWke = getExtent('sub_antarctica')
    const expectedUpdatedIsoExtent: Extent = {
      identifier: expectedIsoExtentIdentifier,
      geographic: updatedWke.extent.geographic,
    }

    const wrapper = mount(GeographicExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // initial value
    const emittedIsoExtent: unknown[][] | undefined = wrapper.emitted('update:isoExtent')
    expect(emittedIsoExtent).toBeTruthy()
    if (emittedIsoExtent) {
      expect(emittedIsoExtent[0][0]).toEqual(expectedInitialIsoExtent)
    }

    // set radio input with id 'extent-sub_antarctica' to checked (well known extent)
    await wrapper.find('input#extent-sub_antarctica').setValue()

    await wrapper.vm.$nextTick()

    // updated value
    if (emittedIsoExtent) {
      expect(emittedIsoExtent[1][0]).toEqual(expectedUpdatedIsoExtent)
    }
  })

  it('renders extent from well known extent choice', async () => {
    const wke = getExtent('antarctica')
    const projection = getProjection(wke.projectionSlug)

    const expectedExtent: Extent = {
      identifier: expectedIsoExtentIdentifier,
      geographic: wke.extent.geographic,
    }
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

    expect(wrapper.find('#geographic-extent pre').text()).toBe(
      JSON.stringify(expectedExtent, null, 2)
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

    // set radio input with id 'extent-sub_antarctica' to checked
    await wrapper.find('input#extent-sub_antarctica').setValue()

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

    // set radio input with id 'extent-custom' to checked
    await wrapper.find('input#extent-custom').setValue()

    await wrapper.find('input#bbox-west-long').setValue(expectedValueInExtent)

    expect(wrapper.find('pre').text()).toContain(expectedValueInExtent)
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
