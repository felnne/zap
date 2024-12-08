import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import type { Identifier } from '@/types/iso'
import IdentifierBasGitlab from '@/components/sections/elements/IdentifierBasGitlab.vue'

describe('IdentifierBasGitlab', () => {
  it('emits value when selected and filled in', async () => {
    const identifier = 'https://gitlab.data.bas.ac.uk/MAGIC/general-and-helpdesk/-/issues/xxx'
    const expectedIdentifier: Identifier = {
      identifier: identifier,
      href: identifier,
      namespace: 'gitlab.data.bas.ac.uk',
    }

    const wrapper = mount(IdentifierBasGitlab)

    // enable identifier
    await wrapper.find('input#identifier-bas-gitlab-selection').setValue()

    // set identifier (needs to be after it's enabled)
    await wrapper.find('input#identifier-bas-gitlab-id').setValue(identifier)

    const emittedIdentifier: unknown[][] | undefined = wrapper.emitted('add:identifier')
    expect(emittedIdentifier).toBeTruthy()
    if (emittedIdentifier) {
      // the first event ([0]) is the initial value when the identifier is enabled so check the next
      expect(emittedIdentifier[1][0]).toEqual(expectedIdentifier)
    }
  })

  it("doesn't emit value when not selected", async () => {
    const wrapper = mount(IdentifierBasGitlab)

    const emittedIdentifier = wrapper.emitted('add:identifier')
    expect(emittedIdentifier).not.toBeTruthy()
  })

  it('emits removal when selected and unselected', async () => {
    const wrapper = mount(IdentifierBasGitlab)

    // enable identifier
    await wrapper.find('input#identifier-bas-gitlab-selection').setValue()

    const emittedIdentifierAdd = wrapper.emitted('add:identifier')
    expect(emittedIdentifierAdd).toBeTruthy()

    // disable identifier
    await wrapper.find('input#identifier-bas-gitlab-selection').setValue(false)

    const emittedIdentifierRemove = wrapper.emitted('remove:identifier')
    expect(emittedIdentifierRemove).toBeTruthy()
  })

  it('has a disabled value input when not enabled', async () => {
    const wrapper = mount(IdentifierBasGitlab)

    const inputElement = wrapper.find('input#identifier-bas-gitlab-id')
    expect(inputElement.attributes().disabled).toBe('')
  })
})
