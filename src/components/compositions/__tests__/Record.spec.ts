import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { AccessRestriction } from '@/types/app'
import type {
  Record as IsoRecord,
  Constraint as IsoConstraint,
  DistributionOption as IsoDistributionOption,
} from '@/types/iso'
import { getLicence, getOrganisation, getService } from '@/lib/data'
import { createAccessConstraint, createUsageConstraint } from '@/lib/constraints'
import { createServiceDistributionOption } from '@/lib/distribution'
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

  it('emits record when directly set section changes', async () => {
    const expectedAbstract = 'x'

    const wrapper = mount(Record, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from a child component that sets its field directly in ISO record
    const updatedComponent = wrapper.findComponent({ name: 'Abstract' })
    await updatedComponent.vm.$emit('update:isoAbstract', expectedAbstract)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      const emittedIsoRecordTyped = emittedIsoRecord[0][0] as IsoRecord
      expect(emittedIsoRecordTyped.identification.abstract).toEqual(expectedAbstract)
    }
  })

  it('emits record when a section that forms aggregated constraints changes', async () => {
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
    const accessComponent = wrapper.findComponent({ name: 'Access' })
    await accessComponent.vm.$emit('update:isoAccess', expectedAccessConstraint)

    // simulate event from child component that sets its field as part of constraints computed property [Licence]
    const licenceComponent = wrapper.findComponent({ name: 'Licence' })
    await licenceComponent.vm.$emit('update:isoLicence', expectedUsageConstraint)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to 3st index to wait for both properties to be included and initial emits from licence to be ignored
      const emittedIsoRecordTyped = emittedIsoRecord[3][0] as IsoRecord
      expect(emittedIsoRecordTyped.identification.constraints).toEqual([
        expectedAccessConstraint,
        expectedUsageConstraint,
      ])
    }
  })

  it('emits record when a section that forms aggregated distribution options changes', async () => {
    // streamline building this when files are option from download distribution options
    const expectedDownloadsDistOptions: IsoDistributionOption[] = [
      {
        format: {
          format: 'image/png',
          href: 'https://www.iana.org/assignments/media-types/image/png',
        },
        transfer_option: {
          online_resource: {
            title: 'image',
            description: 'Download image',
            function: 'download',
            href: 'https://example.com/image.png',
          },
        },
        distributor: {
          organisation: {
            name: 'Example Corp',
            href: 'https://ror.org/000000000',
            title: 'ror',
          },
          role: ['distributor'],
        },
      },
    ]

    const expectedServiceSlug = 'wms'
    const expectedService = getService(expectedServiceSlug)
    const expectedDistributor = getOrganisation('bas_magic')
    const expectedEndpoint = 'https://www.example.com'
    const expectedServicesDistOptions = [
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
    const downloadsComponent = wrapper.findComponent({ name: 'Downloads' })
    await downloadsComponent.vm.$emit(
      'update:isoDistOptionsDownloads',
      expectedDownloadsDistOptions
    )

    // simulate event from field that's part of distribution options computed property [Services]
    const servicesComponent = wrapper.findComponent({ name: 'Services' })
    await servicesComponent.vm.$emit('update:isoDistOptionsServices', expectedServicesDistOptions)

    const emittedIsoRecord: unknown[][] | undefined = wrapper.emitted('update:isoRecord')
    expect(emittedIsoRecord).toBeTruthy()
    if (emittedIsoRecord) {
      // skip to 4th index to wait for both properties to be included
      const emittedIsoRecordTyped = emittedIsoRecord[4][0] as IsoRecord
      expect(emittedIsoRecordTyped.distribution).toEqual([
        ...expectedDownloadsDistOptions,
        ...expectedServicesDistOptions,
      ])
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
