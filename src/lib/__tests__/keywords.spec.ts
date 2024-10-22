import { describe, it, expect } from 'vitest'

import {
  _getUniqueItems,
  getKeywordSetRef,
  getUniqueKeywords,
  getUniqueTerms,
} from '@/lib/keywords'
import type { KeywordSet } from '@/types/iso'

describe('_getUniqueItems', () => {
  it('returns unique string items', () => {
    const input = ['a', 'a']
    const expected = ['a']

    expect(_getUniqueItems(input)).toStrictEqual(expected)
  })

  it('returns unique object items', () => {
    const input = [{ key: 'a' }, { key: 'a' }]
    const expected = [{ key: 'a' }]

    expect(_getUniqueItems(input)).toStrictEqual(expected)
  })
})

describe('getKeywordSetRef', () => {
  it('returns a reference for a keyword set', () => {
    const input: KeywordSet = {
      terms: [],
      type: 'topic',
      thesaurus: {
        title: {
          value: 'x',
        },
        edition: '1',
      },
    }
    const expected = 'topic/x/1'

    expect(getKeywordSetRef(input)).toStrictEqual(expected)
  })
})

describe('getUniqueKeywords', () => {
  it('returns unique terms for a list of keyword sets', () => {
    const input: KeywordSet[] = [
      {
        terms: [{ term: 'a' }, { term: 'b' }],
        type: 'topic',
        thesaurus: {
          title: {
            value: 'Set 1',
          },
          edition: '1',
        },
      },
      {
        terms: [{ term: 'a' }, { term: 'c' }],
        type: 'topic',
        thesaurus: {
          title: {
            value: 'Set 1',
          },
          edition: '1',
        },
      },
      {
        terms: [{ term: 'a' }, { term: 'b' }],
        type: 'topic',
        thesaurus: {
          title: {
            value: 'Set 1',
          },
          edition: '2',
        },
      },
      {
        terms: [{ term: 'x' }, { term: 'y' }],
        type: 'topic',
        thesaurus: {
          title: {
            value: 'Set 2',
          },
          edition: '1',
        },
      },
    ]
    const expected: KeywordSet[] = [
      {
        terms: [{ term: 'a' }, { term: 'b' }, { term: 'c' }],
        type: 'topic',
        thesaurus: {
          title: {
            value: 'Set 1',
          },
          edition: '1',
        },
      },
      {
        terms: [{ term: 'a' }, { term: 'b' }],
        type: 'topic',
        thesaurus: {
          title: {
            value: 'Set 1',
          },
          edition: '2',
        },
      },
      {
        terms: [{ term: 'x' }, { term: 'y' }],
        type: 'topic',
        thesaurus: {
          title: {
            value: 'Set 2',
          },
          edition: '1',
        },
      },
    ]

    expect(getUniqueKeywords(input)).toStrictEqual(expected)
  })
})

describe('getUniqueTerms', () => {
  it('returns unique terms', () => {
    const input = ['a', 'a']
    const expected = ['a']

    expect(getUniqueTerms(input)).toStrictEqual(expected)
  })
})
