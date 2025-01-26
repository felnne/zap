import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { Series as SeriesT } from '@/types/app'
import type { Series as IsoSeries } from '@/types/iso'
import Series from '@/components/sections/elements/Series.vue'

import seriesData from '@/data/series.json'

const edition = '1'

describe('Series', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders series as choices', async () => {
    const expectedSeries: SeriesT[] = Object.values(seriesData.series)

    const wrapper = mount(Series, {
      props: {
        edition: edition,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expectedSeries.every((aSeries) =>
      expect(wrapper.find(`input#series-${aSeries.slug}`).exists()).toBeTruthy()
    )
  })

  it('renders series for single choice', async () => {
    const series: SeriesT = Object.values(seriesData.series)[0]

    const wrapper = mount(Series, {
      props: {
        edition: edition,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set checkbox input with id 'series-321fce3c_8495_428d_b389_985953fe57e5' to checked
    await wrapper.find(`input#series-${series.slug}`).setValue()

    expect(wrapper.find('pre').text()).toContain(series.name)
  })

  it('emits values when updated', async () => {
    const seriesA: SeriesT = Object.values(seriesData.series)[0]
    const seriesB: SeriesT = Object.values(seriesData.series)[1]
    const isoSeriesA: IsoSeries = { name: seriesA.name, edition: edition }
    const isoSeriesB: IsoSeries = { name: seriesB.name, edition: edition }
    // sheet/page omitted as currently omitted from underlying ISO schema

    const wrapper = mount(Series, {
      props: {
        edition: edition,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    await wrapper.find(`input#series-${seriesA.slug}`).setValue()
    await wrapper.vm.$nextTick()

    const emittedSeries = wrapper.emitted('update:series') as SeriesT[][][]
    expect(emittedSeries).toBeTruthy()
    if (emittedSeries) {
      expect(emittedSeries[0][0]).toEqual(seriesA)
    }
    const emittedIsoSeries = wrapper.emitted('update:isoSeries') as IsoSeries[][][]
    expect(emittedIsoSeries).toBeTruthy()
    if (emittedIsoSeries) {
      expect(emittedIsoSeries[0][0]).toEqual(isoSeriesA)
    }

    // update selection, entirely replacing previous selection
    await wrapper.find(`input#series-${seriesB.slug}`).setValue()
    await wrapper.vm.$nextTick()

    if (emittedSeries[1]) {
      expect(emittedSeries[1][0]).toEqual(seriesB)
    }
    if (emittedIsoSeries[1]) {
      expect(emittedIsoSeries[1][0]).toEqual(isoSeriesB)
    }
  })

  it('disables sheet input as not yet supported', async () => {
    const wrapper = mount(Series, {
      props: {
        edition: edition,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('input#sheet').attributes().disabled).toBe('')
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
