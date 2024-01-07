import type {
  Format,
  Idea,
  Individual,
  Licence,
  Organisation,
  Service,
  WellKnownExtent
} from '@/types/app'

import extentsData from '@/data/extents.json'
import formatsData from '@/data/formats.json'
import ideasData from '@/data/ideas.json'
import individualsData from '@/data/individuals.json'
import licencesData from '@/data/licences.json'
import organisationsData from '@/data/organisations.json'
import servicesData from '@/data/services.json'
import settingsData from '@/data/settings.json'

export const getExtent = (slug: string): WellKnownExtent => {
  return (extentsData.geographic as Record<string, WellKnownExtent>)[slug]
}

export const getExtents = (): WellKnownExtent[] => {
  return Object.values(extentsData.geographic)
}

export const getFormat = (slug: string): Format => {
  return (formatsData.formats as Record<string, Format>)[slug]
}

export const getFormatByExtension = (extension: string): Format | undefined => {
  const match = Object.values(formatsData.formats).find(
    (format: Format) => format.extensions?.includes(extension)
  )
  if (match) return match
}

export const getFormatByType = (type: string): Format | undefined => {
  const match = Object.values(formatsData.formats).find(
    (format: Format) => format.mediaTypes?.includes(type)
  )
  if (match) return match
}

export const getFormats = (): Format[] => {
  return Object.values(formatsData.formats)
}

export const getFormatExtensions = (): string[] => {
  return Object.values(formatsData.formats)
    .flatMap((format: Format) => format.extensions || [])
    .filter((extension: string) => extension !== undefined)
}

export const getIdeas = (): Idea[] => {
  return Object.values(ideasData.ideas)
}

export const getIndividuals = (): Individual[] => {
  // sorted alphabetically
  return Object.values(individualsData.contacts).sort((a: Individual, b: Individual) =>
    a.name.localeCompare(b.name)
  )
}

export const getLicence = (slug: string): Licence => {
  return (licencesData.licences as Record<string, Licence>)[slug]
}

export const getLicences = (): Licence[] => {
  return Object.values(licencesData.licences)
}

export const getOrganisation = (slug: string): Organisation => {
  return (organisationsData.organisations as Record<string, Organisation>)[slug]
}

export const getService = (slug: string): Service => {
  return (servicesData.services as Record<string, Service>)[slug]
}

export const getServiceSlugs = (): string[] => {
  // sorted alphabetically
  return Object.keys(servicesData.services).sort((a: string, b: string) => a.localeCompare(b))
}

export const getSetting = (key: string): string => {
  return (settingsData as Record<string, string>)[key]
}
