import type { Address, Identifier, PointOfContact as Contact, OnlineResource } from '@/iso'

export type DateImprecise = {
  js: Date
  iso: string
  precision: string
}

export type DateImpreciseLabelled = {
  date: DateImprecise
  label: string
}

type File = {
  bytes: number
  type: string
  name: string
  ext: string
}

export type Format = {
  slug: string
  ext: string[]
  name: string
  version: string
  url: string
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
  resourceType: string
  identifiers: Identifier[]
  edition: string
  title: string
  dates: DateImpreciseLabelled[]
  contacts: Contact[]
}

type Service = {
  slug: string
  name: string
  description: string
  format: ServiceFormat
}

export type ServiceFormat = {
  name: string
  version: string
  href: string
}

export type TocItem = {
  anchor: string
  title: string
}

type WellKnownExtent = {
  slug: string
  name: string
  extent: {
    geographic: GeographicExtent
  }
}
