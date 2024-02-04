import type { KeywordSet } from '@/types/iso'

export const _getUniqueItems = <T>(list: T[]): T[] => {
  /*
   * Return distinct/unique items within a list
   *
   * Serialises each item to JSON, use set to remove duplicates and parse results back to the original type
   */
  const uniqueList = Array.from(new Set(list.map((item) => JSON.stringify(item))))
  return uniqueList.map((item) => JSON.parse(item as string))
}

export const getKeywordSetRef = (keywordSet: KeywordSet): string => {
  /*
   * Generate a unique reference for a keyword set
   *
   * Currently sensitive to:
   * - keyword set type (topic, place, etc.)
   * - thesaurus title
   * - thesaurus edition
   */
  return `${keywordSet.type}/${keywordSet.thesaurus.title.value}/${keywordSet.thesaurus.edition}`
}

export const getUniqueKeywords = (keywords: KeywordSet[]): KeywordSet[] => {
  /*
   * Return unique terms for a list of keyword sets
   *
   * E.g. For (simplified) keyword sets:
   * [
   *   {'terms': ['a', 'b'], 'set': 'list 1'}
   *   {'terms': ['a', 'c'], 'set': 'list 1'}
   *   {'terms': ['x', 'y'], 'set': 'list 2'}
   * ]
   *
   * This method returns:
   * [
   *   {'terms': ['a', 'b', 'c'], 'set': 'list 1'}
   *   {'terms': ['x', 'y'], 'set': 'list 2'}
   * ]
   *
   * Steps:
   * - loop through each keyword set
   * - get a string reference for the set
   * - if the reference doesn't exist in the sets object yet, collect it along with it's terms
   * - add the terms from the set to the (now) existing set, avoiding duplicates
   * - return the collected sets as a list
   */
  const sets: Record<string, KeywordSet> = {}

  keywords.forEach((keywordSet: KeywordSet) => {
    const ref = getKeywordSetRef(keywordSet)

    if (!sets[ref]) {
      sets[ref] = keywordSet
    }

    sets[ref].terms = _getUniqueItems([...sets[ref].terms, ...keywordSet.terms])
  })

  return Object.values(sets)
}

export const getUniqueTopics = (topics: string[]): string[] => {
  /*
   * Wrapper for _getUniqueItems to return a unique list topics
   *
   * Example:
   * > getUniqueTopics(['a', 'b', 'a', 'c', 'b'])
   * ['a', 'b', 'c']
   */
  return _getUniqueItems(topics)
}
