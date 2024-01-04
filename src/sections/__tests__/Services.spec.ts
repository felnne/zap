import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Services from '@/sections/Services.vue'

import servicesData from '@/data/services.json'

describe('Services', () => {
  it('renders properly', async () => {
    const serviceSlugs: string[] = Object.keys(servicesData.services).sort((a: string, b: string) =>
      a.localeCompare(b)
    )

    const wrapper = mount(Services)

    serviceSlugs.every((service) =>
      expect(wrapper.find(`input#service-${service}-selection`).exists()).toBeTruthy()
    )
  })
})
