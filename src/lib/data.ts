import type {
  Format,
  Idea,
  Individual,
  KeywordSet,
  Licence,
  Organisation,
  Projection,
  Service,
  WellKnownExtent,
} from '@/types/app'
import type { DomainConsistency } from '@/types/iso'

import extentsData from '@/data/extents.json'
import formatsData from '@/data/formats.json'
import ideasData from '@/data/ideas.json'
import individualsData from '@/data/individuals.json'
import keywordSetData from '@/data/keywords.json'
import licencesData from '@/data/licences.json'
import organisationsData from '@/data/organisations.json'
import profilesData from '@/data/profiles.json'
import projectionsData from '@/data/projections.json'
import servicesData from '@/data/services.json'
import settingsData from '@/data/settings.json'

type StrKeyObj = { [key: string]: unknown }

const _isObject = (item: unknown): item is StrKeyObj => {
  /* Check if an item is an object */
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

export const deepMergeObjects = (source: StrKeyObj, target: StrKeyObj): StrKeyObj => {
  /* Merge the first object into a clone of the second recursively, returning the new object. */
  const output = JSON.parse(JSON.stringify(source))

  if (_isObject(target) && _isObject(source)) {
    Object.keys(target).forEach((key) => {
      if (_isObject(target[key]) || _isObject(source[key])) {
        if (!(key in source) || !_isObject(source[key])) {
          Object.assign(output, { [key]: target[key] })
        } else {
          output[key] = deepMergeObjects(source[key] as StrKeyObj, target[key] as StrKeyObj)
        }
      } else {
        Object.assign(output, { [key]: target[key] })
      }
    })
  }
  return output
}

export const getExtent = (slug: string): WellKnownExtent => {
  /* Get information for a specific well known extent */
  return (extentsData.geographic as Record<string, WellKnownExtent>)[slug]
}

export const getExtents = (): WellKnownExtent[] => {
  /* Get information for all well known extents */
  return Object.values(extentsData.geographic)
}

export const getDomainConsistency = (slug: string): DomainConsistency => {
  /* Get information for a specific profile (represented as a domain consistency element) */
  return (profilesData.profiles as Record<string, DomainConsistency>)[slug]
}

export const getFormat = (slug: string): Format => {
  /* Get information for a specific file format */
  return (formatsData.formats as Record<string, Format>)[slug]
}

export const getFormatByExtension = (extension: string): Format | undefined => {
  /* Get file format information for file extension (if known) */
  const match = Object.values(formatsData.formats).find((format: Format) =>
    format.extensions?.includes(extension)
  )
  if (match) return match
}

export const getFormatByType = (type: string): Format | undefined => {
  /* Get file format information for media type (if known) */
  const match = Object.values(formatsData.formats).find((format: Format) =>
    format.mediaTypes?.includes(type)
  )
  if (match) return match
}

export const getFormats = (): Format[] => {
  /* Get information for all file formats */
  return Object.values(formatsData.formats)
}

export const getFormatExtensions = (): string[] => {
  /*
   * Get supported file extensions for all file format
   *
   * Aggregates file extensions for all formats to give a combined array of supported extensions.
   */
  return Object.values(formatsData.formats)
    .flatMap((format: Format) => format.extensions || [])
    .filter((extension: string) => extension !== undefined)
}

export const getIdeas = (): Idea[] => {
  /* Get all ideas */
  return Object.values(ideasData.ideas)
}

export const getIndividual = (slug: string): Individual => {
  /* Get information for a specific individual */
  return (individualsData.contacts as Record<string, Individual>)[slug]
}

export const getIndividuals = (): Individual[] => {
  /*
   * Get information for all individuals
   *
   * Individuals are sorted alphabetically by name property.
   */
  return Object.values(individualsData.contacts).sort((a: Individual, b: Individual) =>
    a.name.localeCompare(b.name)
  )
}

export const getKeywordSet = (slug: string): KeywordSet => {
  /* Get a specific keyword set */
  return (keywordSetData.keywords as Record<string, KeywordSet>)[slug]
}

export const getLicence = (slug: string): Licence => {
  /* Get information for a specific licence */
  return (licencesData.licences as Record<string, Licence>)[slug]
}

export const getLicences = (): Licence[] => {
  /* Get information for all licences */
  return Object.values(licencesData.licences)
}

export const getLicencesFiltered = (open: boolean): Licence[] => {
  /*
   * Get information for all open or closed licences
   *
   * Licences are filtered based on the `open` property.
   */
  return getLicences().filter((licence) => licence.open === open)
}

export const getOrganisation = (slug: string): Organisation => {
  /* Get information for a specific organisation */
  return (organisationsData.organisations as Record<string, Organisation>)[slug]
}

export const getProjection = (slug: string): Projection => {
  /* Get information for a specific projection */
  return (projectionsData.projections as Record<string, Projection>)[slug]
}

export const getService = (slug: string): Service => {
  /* Get information for a specific service type */
  return (servicesData.services as Record<string, Service>)[slug]
}

export const getServiceSlugs = (): string[] => {
  /*
   * Get all slugs for services
   *
   * services sorted alphabetically by slug property.
   */
  return Object.keys(servicesData.services).sort((a: string, b: string) => a.localeCompare(b))
}

export const getSetting = (key: string): string => {
  /* Get specific application setting */
  return (settingsData.settings as Record<string, string>)[key]
}
