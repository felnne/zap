import type {
  Collection,
  Format,
  Idea,
  Individual,
  KeywordSet,
  Licence,
  Organisation,
  PhysicalSize,
  Projection,
  Series,
  Service,
  Thumbnail,
  WellKnownExtent,
} from '@/types/app'
import type { DomainConsistency } from '@/types/iso'

import collectionsData from '@/data/collections.json'
import extentsData from '@/data/extents.json'
import formatsData from '@/data/formats.json'
import ideasData from '@/data/ideas.json'
import individualsData from '@/data/individuals.json'
import keywordSetData from '@/data/keywords.json'
import licencesData from '@/data/licences.json'
import organisationsData from '@/data/organisations.json'
import physicalSizesData from '@/data/physical_sizes.json'
import profilesData from '@/data/profiles.json'
import projectionsData from '@/data/projections.json'
import seriesData from '@/data/series.json'
import servicesData from '@/data/services.json'
import settingsData from '@/data/settings.json'
import thumbnailsData from '@/data/thumbnails.json'

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

export const getCollections = (): Collection[] => {
  /* Get information for all collections */
  return Object.values(collectionsData.collections)
}

export const getExtent = (slug: string): WellKnownExtent => {
  /* Get information for a specific well known extent */
  const value = (extentsData.geographic as Record<string, WellKnownExtent>)[slug]
  if (value === undefined) {
    throw new Error(`Extent "${slug}" not found`)
  }
  return value
}

export const getExtents = (): WellKnownExtent[] => {
  /* Get information for all well known extents */
  return Object.values(extentsData.geographic)
}

export const getDomainConsistency = (slug: string): DomainConsistency => {
  /* Get information for a specific profile (represented as a domain consistency element) */
  const value = (profilesData.profiles as Record<string, DomainConsistency>)[slug]
  if (value === undefined) {
    throw new Error(`Domain consistency "${slug}" not found`)
  }
  return value
}

export const getFormat = (slug: string): Format => {
  /* Get information for a specific file format */
  const value = (formatsData.formats as Record<string, Format>)[slug]
  if (value === undefined) {
    throw new Error(`Format "${slug}" not found`)
  }
  return value
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
  const value = (individualsData.contacts as Record<string, Individual>)[slug]
  if (value === undefined) {
    throw new Error(`Individual "${slug}" not found`)
  }
  return value
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
  const value = (keywordSetData.keywords as Record<string, KeywordSet>)[slug]
  if (value === undefined) {
    throw new Error(`Keyword set "${slug}" not found`)
  }
  return value
}

export const getLicence = (slug: string): Licence => {
  /* Get information for a specific licence */
  const value = (licencesData.licences as Record<string, Licence>)[slug]
  if (value === undefined) {
    throw new Error(`Licence "${slug}" not found`)
  }
  return value
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
  const value = (organisationsData.organisations as Record<string, Organisation>)[slug]
  if (value === undefined) {
    throw new Error(`Organisation "${slug}" not found`)
  }
  return value
}

export const getPhysicalSizes = (): PhysicalSize[] => {
  /* Get information for all physical sizes */
  return Object.values(physicalSizesData.sizes)
}

export const getProjection = (slug: string): Projection => {
  /* Get information for a specific projection */
  return (projectionsData.projections as Record<string, Projection>)[slug]
}

export const getSeries = (): Series[] => {
  /* Get information for all series */
  return Object.values(seriesData.series)
}

export const getService = (slug: string): Service => {
  /* Get information for a specific service type */
  const value = (servicesData.services as Record<string, Service>)[slug]
  if (value === undefined) {
    throw new Error(`Service "${slug}" not found`)
  }
  return value
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
  const value = (settingsData.settings as Record<string, string | undefined>)[key]
  if (value === undefined) {
    throw new Error(`Setting "${key}" not found`)
  }
  return value
}

export const getThumbnails = (): Thumbnail[] => {
  /* Get information for all thumbnail types */
  return Object.values(thumbnailsData.thumbnails).map(
    ({ size_px_h, size_px_w, media_types, ...thumbnail }) => ({
      ...thumbnail,
      sizePxH: size_px_h,
      sizePxW: size_px_w,
      mediaTypes: media_types,
    })
  )
}
