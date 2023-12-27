import { type Address, type OnlineResource } from './iso'

export type DateImprecise = {
  label: string
  value: Date
  precision: string
}

export type Format = {
  slug: string
  ext: string[]
  name: string
  version: string
  url: string
}

export type Individual = {
  name: string
  orcid: string
  email: string
}

type Licence = {
  name: string
  url: string
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
