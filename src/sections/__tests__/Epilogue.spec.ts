import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Epilogue from '@/sections/Epilogue_v1_0.vue'

describe('Epilogue', () => {
  it('renders properly', async () => {
    const wrapper = mount(Epilogue)

    expect(wrapper.find('#app-release').text()).toContain('dev')
  })
})
