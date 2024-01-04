import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Epilogue from '@/sections/Epilogue.vue'

describe('Epilogue', () => {
  it('renders properly in local development', async () => {
    const wrapper = mount(Epilogue)

    expect(wrapper.find('#app-release').text()).toBe('dev')
  })
})
