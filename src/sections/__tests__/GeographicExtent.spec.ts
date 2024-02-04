import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { Extent, ReferenceSystemInfo } from '@/types/iso'
import { getExtent, getProjection } from '@/utils/data'
import GeographicExtent from '@/sections/GeographicExtent.vue'

vi.mock('@/utils/esriNoTest', () => ({
  initExtentMap: vi.fn().mockReturnValue({ mock: true }),
  initExtentGlobe: vi.fn().mockReturnValue({ mock: true }),
  loadCssTheme: vi.fn().mockReturnValue({ mock: true }),
}))

describe('GeographicExtent', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders extent from choice', async () => {
    const wke = getExtent('antarctica')
    const projection = getProjection(wke.projectionSlug)

    const expectedExtent: Extent = {
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

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
