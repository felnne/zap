import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { AccessRestriction, Licence, Format } from '@/types/app'
import type {
  Record as IsoRecord,
  Constraint as IsoConstraint,
  DistributionOption as IsoDistributionOption,
  Lineage as IsoLineage,
  PointOfContact as IsoContact,
} from '@/types/iso'
import { getFormatByType, getLicence, getService } from '@/lib/data'
import { createAccessConstraint, createUsageConstraint } from '@/lib/constraints'
import {
  createDistributor,
  createDownloadDistributionOption,
  createServiceDistributionOption,
} from '@/lib/distribution'
import Record from '@/components/compositions/Record.vue'

vi.mock('@/lib/esriNoTest', () => ({
  initExtentMap: vi.fn().mockReturnValue({ mock: true }),
  initExtentGlobe: vi.fn().mockReturnValue({ mock: true }),
  loadCssTheme: vi.fn().mockReturnValue({ mock: true }),
}))

describe('Record [Integration]', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits ISO record correctly when set section directly changes', async () => {
    const expectedAbstract = 'x'

    const wrapper = mount(Record, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from a child component that sets its field directly in ISO record
    await wrapper
      .findComponent({ name: 'Abstract' })
      .vm.$emit('update:isoAbstract', expectedAbstract)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for properties set by default to be included
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      expect(emittedIsoRecordTyped.identification.abstract).toEqual(expectedAbstract)
    }
  })

  it('emits ISO record correctly when a section that forms aggregated constraints changes', async () => {
    const expectedAccessRestriction: AccessRestriction = {
      slug: 'anonymous',
      restriction: 'unrestricted',
      label: 'Open Access (Anonymous)',
      permissions: [],
    }
    const expectedAccessConstraint: IsoConstraint =
      createAccessConstraint(expectedAccessRestriction)

    const expectedLicence = getLicence('OGL_UK_3_0')
    const expectedUsageConstraint: IsoConstraint = createUsageConstraint(expectedLicence)

    const wrapper = mount(Record, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from child component that sets its field as part of constraints computed property [Access]
    await wrapper
      .findComponent({ name: 'Access' })
      .vm.$emit('update:isoAccess', expectedAccessConstraint)

    // simulate event from child component that sets its field as part of constraints computed property [Licence]
    await wrapper
      .findComponent({ name: 'Licence' })
      .vm.$emit('update:isoLicence', expectedUsageConstraint)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for both properties to be included and initial emits from licence to be ignored
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      expect(emittedIsoRecordTyped.identification.constraints).toEqual([
        expectedAccessConstraint,
        expectedUsageConstraint,
      ])
    }
  })

  it('emits ISO record correctly when a section that forms aggregated distribution options changes', async () => {
    const licence: Licence = getLicence('OGL_UK_3_0')
    const resourceType = ResourceType.Dataset
    const expectedDistributor: IsoContact = createDistributor(resourceType, licence)

    const expectedFormat: Format = getFormatByType('image/png') as Format
    const expectedUrl = 'https://example.com/image.png'
    const expectedDownloadsDistOptions: IsoDistributionOption[] = [
      createDownloadDistributionOption(expectedFormat, expectedUrl, expectedDistributor),
    ]

    const expectedServiceSlug = 'wms'
    const expectedService = getService(expectedServiceSlug)
    const expectedEndpoint = 'https://www.example.com'
    const expectedServicesDistOptions: IsoDistributionOption[] = [
      createServiceDistributionOption(expectedService, expectedEndpoint, expectedDistributor),
    ]

    const wrapper = mount(Record, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from field that's part of distribution options computed property [Downloads]
    await wrapper
      .findComponent({ name: 'Downloads' })
      .vm.$emit('update:isoDistOptionsDownloads', expectedDownloadsDistOptions)

    // simulate event from field that's part of distribution options computed property [Services]
    await wrapper
      .findComponent({ name: 'Services' })
      .vm.$emit('update:isoDistOptionsServices', expectedServicesDistOptions)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for both properties to be included
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      expect(emittedIsoRecordTyped.distribution).toEqual([
        ...expectedDownloadsDistOptions,
        ...expectedServicesDistOptions,
      ])
    }
  })

  it('emits ISO record correctly when no sections that form aggregated distribution options set', async () => {
    const wrapper = mount(Record, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from unrelated child component to trigger ISO record emit
    await wrapper.findComponent({ name: 'Abstract' }).vm.$emit('update:isoAbstract', 'x')

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for properties set by default to be included
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      // expect not to have distribution key set
      expect(emittedIsoRecordTyped.distribution).toBeUndefined()
    }
  })

  it('emits ISO record correctly when a section that forms aggregated lineage changes', async () => {
    // streamline building this when files are option from download distribution options
    const expectedLineage: IsoLineage = {
      statement: 'x',
    }

    const wrapper = mount(Record, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from field that's part of lineage computed property [Statement]
    await wrapper
      .findComponent({ name: 'Lineage' })
      .vm.$emit('update:isoLineageStatement', expectedLineage.statement)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index is to wait for properties set by default to be included
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      expect(emittedIsoRecordTyped.identification.lineage).toEqual(expectedLineage)
    }
  })

  it('emits ISO record correctly when no sections that form aggregated lineage set', async () => {
    const wrapper = mount(Record, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from unrelated child component to trigger ISO record emit
    await wrapper.findComponent({ name: 'Abstract' }).vm.$emit('update:isoAbstract', 'x')

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for properties set by default to be included
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      // expect not to have lineage key set
      expect(emittedIsoRecordTyped.identification.lineage).toBeUndefined()
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
