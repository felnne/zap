import { ResourceType } from '@/types/enum'
import type { Address, Identifier, PointOfContact as Contact, OnlineResource } from '@/iso'

type AccessPermission = {
  scheme: string
  schemeVersion: string
  directoryId: string
  objectId: string | null
}

type AccessRestriction = {
  slug: string
  restriction: string
  label: string
  permissions: AccessPermission[]
}

export type AppEnvironment = {
  mode: string
  commit?: string
  time?: string
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

type Licence = {
  slug: string
  name: string
  url: string
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

export type Record = {
  fileIdentifier: string
  resourceType: ResourceType
  identifiers: Identifier[]
  edition: string
  title: string
  dates: DateImpreciseLabelled[]
  contacts: Contact[]
  accessRestriction: AccessRestriction
}

type Service = {
  slug: string
  name: string
  description: string
}

type WellKnownExtent = {
  slug: string
  name: string
  extent: {
    geographic: GeographicExtent
  }
}
