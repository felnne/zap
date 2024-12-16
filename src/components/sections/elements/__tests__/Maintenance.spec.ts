import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceStatus, ResourceUpdateFrequency } from '@/types/enum'
import type { Maintenance as MaintenanceT } from '@/types/iso'
import Maintenance from '@/components/sections/elements/Maintenance.vue'

const expectedMaintenance: MaintenanceT = {
  progress: ResourceStatus.draft,
  maintenance_frequency: ResourceUpdateFrequency.asNeeded,
}

describe('Maintenance', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders and emits maintenance info', async () => {
    const wrapper = mount(Maintenance, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('pre').text()).toBe(JSON.stringify(expectedMaintenance, null, 2))

    const emittedIsoMaintenance: unknown[][] | undefined = wrapper.emitted('update:isoMaintenance')
    expect(emittedIsoMaintenance).toBeTruthy()
    if (emittedIsoMaintenance) {
      expect(emittedIsoMaintenance[0][0]).toEqual(expectedMaintenance)
    }
  })

  it('updates status from choice', async () => {
    const expectedUpdatedMaintenance = {
      ...expectedMaintenance,
      progress: ResourceStatus.complete,
    }

    const wrapper = mount(Maintenance, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const emittedIsoMaintenance: unknown[][] | undefined = wrapper.emitted('update:isoMaintenance')
    expect(emittedIsoMaintenance).toBeTruthy()
    if (emittedIsoMaintenance) {
      expect(emittedIsoMaintenance[0][0]).toEqual(expectedMaintenance)
    }

    // set radio input with id 'maintenance-status-complete' to checked
    await wrapper.find('input#maintenance-status-complete').setValue()

    expect(wrapper.find('pre').text()).toBe(JSON.stringify(expectedUpdatedMaintenance, null, 2))

    // check second emit for status update
    expect(emittedIsoMaintenance).toBeTruthy()
    if (emittedIsoMaintenance) {
      expect(emittedIsoMaintenance[1][0]).toEqual(expectedUpdatedMaintenance)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
