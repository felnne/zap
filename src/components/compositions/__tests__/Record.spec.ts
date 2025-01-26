import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { AppEnvironmentLabel, ResourceType } from '@/types/enum'
import type { AppEnvironment, AccessRestriction, Licence, Format } from '@/types/app'
import type {
  Record as IsoRecord,
  Constraint as IsoConstraint,
  DistributionOption as IsoDistributionOption,
  Extent as IsoExtent,
  GeographicExtent as IsoGeographicExtent,
  GraphicOverview as IsoGraphicOverview,
  Lineage as IsoLineage,
  PointOfContact as IsoContact,
  Series as IsoSeries,
  TemporalExtent as IsoTemporalExtent,
} from '@/types/iso'
import { createAuthor, createOrgSlugPointOfContact } from '@/lib/contacts'
import {
  getExtent,
  getFormatByType,
  getIndividual,
  getLicence,
  getOrganisation,
  getService,
} from '@/lib/data'
import { createAccessConstraint, createUsageConstraint } from '@/lib/constraints'
import {
  createDistributor,
  createDownloadDistributionOption,
  createServiceDistributionOption,
} from '@/lib/distribution'
import Record from '@/components/compositions/Record.vue'

const minimalEnvironment: AppEnvironment = {
  label: AppEnvironmentLabel.LocalDevelopment,
}

describe('Record [Integration]', () => {
  let tocItemsDiv: HTMLDivElement
  let tocItemsDivTools: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)

    tocItemsDivTools = document.createElement('div')
    tocItemsDivTools.id = 'toc-items-tools'
    document.body.appendChild(tocItemsDivTools)

    // mock dark-mode detection used in licences component
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('renders a section only shown for a non-default resource type', async () => {
    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate change in resource type
    await wrapper
      .findComponent({ name: 'ResourceType' })
      .vm.$emit('update:resourceType', ResourceType.Product)

    // series is a component that's not shown with the default 'dataset' resource type
    expect(wrapper.findComponent({ name: 'Series' }).exists()).toBe(true)
  })

  it('emits ISO record correctly when a section set directly changes', async () => {
    const expectedAbstract = 'x'

    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
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

  it('emits ISO record correctly when a section that forms aggregated contacts changes', async () => {
    const expectedAuthor: IsoContact = createAuthor(
      getIndividual('https_orcid_org_0000_0003_3703_3888'),
      getOrganisation('bas')
    )
    const expectedPoC: IsoContact = createOrgSlugPointOfContact('bas_magic', 'pointOfContact')
    const expectedContacts: IsoContact[] = [expectedAuthor, expectedPoC]

    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from contacts (authors) component that sets part of contacts computed property (merged with PoC)
    await wrapper
      .findComponent({ name: 'Contacts' })
      .vm.$emit('update:isoContacts', [expectedAuthor])

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for property updates to be included and initial emits from contacts to be ignored
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      expect(emittedIsoRecordTyped.identification.contacts).toEqual(expectedContacts)
    }
  })

  it('emits ISO record correctly when a section that forms aggregated graphic overviews changes', async () => {
    const expectedOverview: IsoGraphicOverview = {
      identifier: 'x',
      description: 'xx',
      href: 'https://example.com/image.png',
      mime_type: 'image/png',
    }
    const expectedOverviews: IsoGraphicOverview[] = [expectedOverview]

    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from thumbnails component that sets thumbnails computed property
    await wrapper
      .findComponent({ name: 'Thumbnails' })
      .vm.$emit('update:isoGraphicOverviews', expectedOverviews)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for property updates to be included and initial emits from contacts to be ignored
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      expect(emittedIsoRecordTyped.identification.graphic_overviews).toEqual(expectedOverviews)
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
      props: {
        appEnv: minimalEnvironment,
      },
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

    const expectedServiceSlug = 'fake_service'
    const expectedService = getService(expectedServiceSlug)
    const expectedEndpoint = 'https://www.example.com'
    const expectedServicesDistOptions: IsoDistributionOption[] = [
      createServiceDistributionOption(expectedService, expectedEndpoint, expectedDistributor),
    ]

    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
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
      props: {
        appEnv: minimalEnvironment,
      },
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

  it('emits ISO record correctly when a section that forms aggregated extents changes', async () => {
    const expectedGeographicExtent: IsoGeographicExtent = getExtent('antarctica').extent.geographic
    const expectedTemporalExtent: IsoTemporalExtent = {
      period: { start: '2021-01-01', end: '2021-12-31' },
    }
    const expectedExtent: IsoExtent = {
      identifier: 'bounding',
      geographic: expectedGeographicExtent,
      temporal: expectedTemporalExtent,
    }

    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from child component that sets a part of extents computed property [Geographic]
    await wrapper
      .findComponent({ name: 'GeographicExtent' })
      .vm.$emit('update:isoExtentGeographic', expectedGeographicExtent)

    // simulate event from child component that sets a part of extents computed property [Temporal]
    await wrapper
      .findComponent({ name: 'TemporalExtent' })
      .vm.$emit('update:isoExtentTemporal', expectedTemporalExtent)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for both properties to be included and initial emits from licence to be ignored
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      expect(emittedIsoRecordTyped.identification.extents).toEqual([expectedExtent])
    }
  })

  it('emits ISO record correctly when a section that forms aggregated lineage changes', async () => {
    // streamline building this when files are option from download distribution options
    const expectedLineage: IsoLineage = {
      statement: 'x',
    }

    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
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
      props: {
        appEnv: minimalEnvironment,
      },
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

  it('emits ISO record correctly when optional purpose section is set to an empty value', async () => {
    const expectedSummary = 'x'
    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from optional child component to trigger ISO record emit
    await wrapper.findComponent({ name: 'Summary' }).vm.$emit('update:isoPurpose', expectedSummary)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for properties set by default to be included
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      // expect to have summary property set
      expect(emittedIsoRecordTyped.identification.purpose).toEqual(expectedSummary)
    }

    // simulate event from optional child component to trigger ISO record emit with empty value
    await wrapper.findComponent({ name: 'Summary' }).vm.$emit('update:isoPurpose', '')

    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for any updates
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      // expect not to have summary property set
      expect(emittedIsoRecordTyped.identification.purpose).toBeUndefined()
    }
  })

  it('emits ISO record correctly when optional series section is set to an empty value', async () => {
    const expectedSeries: IsoSeries = { name: 'x', edition: 'xx' }
    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate change in resource type to product to enable child component to be rendered
    await wrapper
      .findComponent({ name: 'ResourceType' })
      .vm.$emit('update:resourceType', ResourceType.Product)

    // simulate event from optional child component to trigger ISO record emit
    await wrapper.findComponent({ name: 'Series' }).vm.$emit('update:isoSeries', expectedSeries)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for properties set by default to be included
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      // expect to have series property set
      expect(emittedIsoRecordTyped.identification.series).toEqual(expectedSeries)
    }

    // simulate event from optional child component to trigger ISO record emit with empty value
    await wrapper.findComponent({ name: 'Series' }).vm.$emit('update:isoSeries', undefined)

    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for any updates
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      // expect not to have summary property set
      expect(emittedIsoRecordTyped.identification.series).toBeUndefined()
    }
  })

  it('emits ISO record correctly when optional physical size section is set to an empty value', async () => {
    const dimensions = { width: 1, height: 2 }
    const expectedInfo = JSON.stringify({
      physical_size_width_mm: dimensions.width,
      physical_size_height_mm: dimensions.height,
    })
    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate change in resource type to product to enable child component to be rendered
    await wrapper
      .findComponent({ name: 'ResourceType' })
      .vm.$emit('update:resourceType', ResourceType.Product)

    // simulate event from optional child component to trigger ISO record emit
    await wrapper.findComponent({ name: 'PhysicalSize' }).vm.$emit('update:dimensions', dimensions)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index to wait for properties set by default to be included
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      // expect to have series property set
      expect(emittedIsoRecordTyped.identification.supplemental_information).toEqual(expectedInfo)
    }
  })

  it('emits ISO record correctly when sample data is set', async () => {
    const expectedTitle = 'x'
    const expectedAbstract = 'xx'
    const expectedLineage: IsoLineage = {
      statement: 'xxx',
    }

    const wrapper = mount(Record, {
      props: {
        appEnv: minimalEnvironment,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const component = wrapper.findComponent({ name: 'RecordSample' })
    component.vm.emit('update:isoTitleValue', expectedTitle)
    component.vm.$emit('update:isoAbstract', expectedAbstract)
    component.vm.$emit('update:isoLineageStatement', expectedLineage.statement)

    await wrapper.vm.$nextTick()

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to the last index is to wait for properties set by default to be included
      const emittedIsoRecordTyped = emittedIsoRecord[emittedIsoRecord.length - 1][0] as IsoRecord
      expect(emittedIsoRecordTyped.identification.title.value).toEqual(expectedTitle)
      expect(emittedIsoRecordTyped.identification.abstract).toEqual(expectedAbstract)
      expect(emittedIsoRecordTyped.identification.lineage).toEqual(expectedLineage)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
    document.body.removeChild(tocItemsDivTools)

    vi.restoreAllMocks()
  })
})
