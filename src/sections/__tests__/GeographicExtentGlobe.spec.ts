import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import type { EsriToken } from '@/types/app'
import { getExtent } from '@/utils/data'

import GeographicExtentGlobe from '@/sections/GeographicExtentGlobe.vue'

vi.mock('@/utils/esriNoTest', () => ({
  initExtentGlobe: vi.fn().mockReturnValue({ mock: true }),
  loadCssTheme: vi.fn().mockReturnValue({ mock: true }),
}))

describe('GeographicExtentGlobe', () => {
  it('renders sign in message when no Esri token', async () => {
    const wke = getExtent('antarctica')

    const wrapper = mount(GeographicExtentGlobe, {
      props: {
        wke: wke,
      },
    })

    expect(wrapper.find('div p').text()).toContain('Sign in to ArcGIS Online in')
  })

  it('omits sign in message with Esri token', async () => {
    const wke = getExtent('antarctica')
    const token: EsriToken = {
      accessToken: 'xxx',
      expiresIn: 1123200,
      expiresAt: new Date(1707908651000),
      username: '-',
    }

    const wrapper = mount(GeographicExtentGlobe, {
      props: {
        wke: wke,
        esriToken: token,
      },
    })

    expect(wrapper.find('div p').exists()).not.toBeTruthy()
  })
})
