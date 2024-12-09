import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { supportedRecord } from '@/lib/__tests__/_validation_data'

import RecordExport from '@/components/sections/tools/RecordExport.vue'

export function mockCreateObjectUrl() {
  const createObjectURLMock = vi.fn().mockImplementation((file: File) => {
    return file.name
  })
  Reflect.deleteProperty(global.window.URL, 'createObjectURL')
  window.URL.createObjectURL = createObjectURLMock
  const revokeObjectURLMock = vi.fn()
  Reflect.deleteProperty(global.window.URL, 'revokeObjectURL')
  window.URL.revokeObjectURL = revokeObjectURLMock
}
mockCreateObjectUrl()

describe('RecordExport', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-tools' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-tools'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders correctly', async () => {
    const wrapper = mount(RecordExport, { props: { currentRecord: supportedRecord } })

    // click export-use-current button
    await wrapper.find('button#export-use-current').trigger('click')

    // can't test the download link here see e2e test
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
