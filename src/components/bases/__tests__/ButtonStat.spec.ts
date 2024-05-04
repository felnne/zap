import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { ValidationStatus } from '@/types/enum'
import ButtonStat from '@/components/bases/ButtonStat.vue'

describe('ButtonStat', () => {
  it('renders properly in empty/initial state', () => {
    const wrapper = mount(ButtonStat, { props: { state: ValidationStatus.Empty } })
    expect(wrapper.attributes().disabled).not.toBeUndefined()
    expect(wrapper.text()).toBe('Set')
  })

  it('renders properly in pending state', () => {
    const wrapper = mount(ButtonStat, { props: { state: ValidationStatus.Pending } })
    expect(wrapper.attributes().disabled).toBeUndefined()
    expect(wrapper.text()).toBe('Set')
  })

  it('renders properly in uploading state', () => {
    const wrapper = mount(ButtonStat, { props: { state: ValidationStatus.Validating } })
    expect(wrapper.attributes().disabled).not.toBeUndefined()
    expect(wrapper.text()).toBe('Checking...')
  })

  it('renders properly in valid state', () => {
    const wrapper = mount(ButtonStat, { props: { state: ValidationStatus.Valid } })
    expect(wrapper.attributes().disabled).not.toBeUndefined()
    expect(wrapper.text()).toBe('OK')
  })

  it('renders properly in invalid state', () => {
    const wrapper = mount(ButtonStat, { props: { state: ValidationStatus.Invalid } })
    expect(wrapper.attributes().disabled).not.toBeUndefined()
    expect(wrapper.text()).toBe('ERROR!')
  })

  it('renders properly in error state', () => {
    const wrapper = mount(ButtonStat, { props: { state: ValidationStatus.Error } })
    expect(wrapper.attributes().disabled).not.toBeUndefined()
    expect(wrapper.text()).toBe('ERROR!')
  })
})
