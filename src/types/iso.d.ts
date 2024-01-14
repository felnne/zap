export type Address = {
  delivery_point: string
  city: string
  administrative_area: string
  postal_code: string
  country: string
}

type Constraint = {
  type: string
  restriction_code: string
  statement?: string
  href?: string
}

export type Dates = {
  [key: string]: string
}

export type DistributionOption = {
  format?: Format
  transfer_option: TransferOption
  distributor: Distributor
}

type Extent = {
  geographic: GeographicExtent
}

export type Format = {
  format: string
  href: string
  version?: string
}

type GeographicExtent = {
  bounding_box: {
    west_longitude: number
    east_longitude: number
    south_latitude: number
    north_latitude: number
  }
}

type Identifier = {
  identifier: string
  href: string
  title: string
}

export type Individual = {
  name: string
  href: string
  title: string
}

export type OnlineResource = {
  href: string
  title: string
  description: string
  function: string
}

export type Organisation = {
  name: string
  href: string
  title: string
}

export type PointOfContact = {
  individual?: Individual
  organisation: Organisation
  email: string
  phone?: string
  address?: Address
  online_resource: OnlineResource
  role: string[]
}

export type Size = {
  unit: string
  magnitude: number
}

export type TransferOption = {
  size?: Size
  online_resource: OnlineResource
}
