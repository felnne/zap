import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import type { EsriToken } from '@/types/app'
import ExternalServices from '@/components/sections/tools/ExternalServices.vue'

describe('FileIdentifier', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-tools' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-tools'
    document.body.appendChild(tocItemsDiv)
  })

  it('shows AGOL sign in link when not signed in', async () => {
    const wrapper = mount(ExternalServices, {})

    expect(wrapper.find('a#external-sign-in-agol').attributes('href')).toContain(
      'https://www.arcgis.com/'
    )
  })

  it('shows and emits AGOL token when callback URL set', async () => {
    window.location.hash = '#access_token=Fjp...zLo&expires_in=1123200&username=conwat_BAS&ssl=true'
    const expectedToken: EsriToken = {
      accessToken: 'Fjp...zLo',
      expiresIn: 1123200,
      expiresAt: new Date(Date.now()),
      username: 'conwat_BAS',
    }

    const wrapper = mount(ExternalServices, {})

    // wait for token to be parsed from callback URL
    await wrapper.vm.$nextTick()

    expect(wrapper.find('a#external-sign-in-agol').exists()).not.toBeTruthy()
    expect(wrapper.find('div#external-token-agol pre').text()).toContain('conwat_BAS')

    const emittedEsriToken: unknown[][] | undefined = wrapper.emitted('update:esriToken')
    expect(emittedEsriToken).toBeTruthy()
    if (emittedEsriToken) {
      expect((emittedEsriToken[0][0] as EsriToken).accessToken).toEqual(expectedToken.accessToken)
    }

    window.location.hash = ''
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
