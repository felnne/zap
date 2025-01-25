import { AppEnvironmentLabel, ResourceType, UploadSource } from '@/types/enum'
import type {
  Address,
  DistributionOption as DistributionOptionIso,
  GeographicExtent as GeographicExtentIso,
  Identifier,
  KeywordSet as KeywordSetIso,
  OnlineResource,
  PointOfContact,
  ReferenceSystemInfo,
} from '@/iso'

export type AccessPermission = {
  scheme: string
  schemeVersion: string
  directoryId: string
  objectId: string | null
}

export type AccessRestriction = {
  slug: string
  restriction: string
  label: string
  permissions: AccessPermission[]
}

export type AppEnvironment = {
  label: AppEnvironmentLabel
  commit?: string
  time?: string
}

export type Collection = {
  slug: string
  name: string
  identifier: string
  href: string
}

export type DateImprecise = {
  js: Date
  iso: string
  precision: string
}

export type DateImpreciseLabelled = {
  date: DateImprecise
  label: string
}

export type DistributionOptionIndexed = {
  index: string
  distributionOption: DistributionOptionIso
}

export type DropdownItem = {
  href: string
  title: string
}

export type EsriToken = {
  accessToken: string
  expiresIn: number
  expiresAt: Date
  username: string
}

export type Format = {
  slug: string
  extensions?: string[]
  mediaTypes?: string[]
  name: string
  description?: string
  version?: string
  url: string
}

export type Idea = {
  label: string
  state: string
}

export type Individual = {
  slug: string
  name: string
  orcid: string
  email: string
}

export type KeywordSet = {
  slug: string
  terms: KeywordTerm[]
}

export type KeywordTerm = {
  slug: string
  name: string
  keywords: KeywordSetIso[]
  isoTopics: string[]
}

export type Licence = {
  slug: string
  name: string
  url: string
  img_light?: string
  img_dark?: string
  statement: string
  open: boolean
}

export type Organisation = {
  slug: string
  name: string
  ror: string
  email?: string
  phone: string
  address: Address
  online_resource: OnlineResource
}

export type Projection = ReferenceSystemInfo & {
  slug: string
}

// only things that pass between components are included here
export type Record = {
  fileIdentifier: string
  resourceType: ResourceType
  identifiers: Identifier[]
  edition: string
  title: string
  abstract: string
  dates: DateImpreciseLabelled[]
  contacts: PointOfContact[]
  accessRestriction: AccessRestriction
  licence: Licence
}

export type Series = {
  slug: string
  name: string
}

export type Service = {
  slug: string
  name: string
  description: string
}
}

export type Thumbnail = {
  slug: string
  identifier: string
  description: string
  sizePxH: number
  sizePxW: number
  mediaTypes: string[]
}

export type WellKnownExtent = {
  slug: string
  name: string
  extent: {
    geographic: GeographicExtentIso
  }
  projectionSlug: string
}

export type Upload = {
  source: UploadSource
  format: Format
  sizeBytes: number
  url: string
}
