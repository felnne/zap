import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { Licence as LicenceT } from '@/types/app'
import type { Constraint } from '@/types/iso'
import Licence from '@/sections/Licence_v1_0.vue'

import licencesData from '@/data/licences.json'

describe('Licence', () => {
  it('renders licence from choice', async () => {
    const expectedLicence: LicenceT = licencesData['licences']['OGL_UK_3_0']
    const expectedConstraint: Constraint = {
      type: 'usage',
      restriction_code: 'license',
      statement: expectedLicence.statement,
      href: expectedLicence.url
    }

    const wrapper = mount(Licence, {
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    expect(wrapper.find('pre').text()).toBe(JSON.stringify(expectedConstraint, null, 2))
  })

  it('updates licence from choice', async () => {
    const expectedLicenceName = 'Creative Commons Attribution 4.0 International'

    const wrapper = mount(Licence, {
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // set radio input with id 'licence-CC_BY_4_0' to checked
    await wrapper.find('input#licence-CC_BY_4_0').setValue()

    expect(wrapper.find('pre').text()).toContain(expectedLicenceName)
  })
})
