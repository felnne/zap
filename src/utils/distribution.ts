import { ResourceType } from '@/types/enum'
import type { Format, Licence, Organisation, Service } from '@/types/app'
import type { DistributionOption, PointOfContact as Contact, OnlineResource } from '@/types/iso'

import { getFormat, getFormatByExtension, getFormatByType, getOrganisation } from '@/utils/data'

export const createDistributor = (org: Organisation): Contact => {
  /*
   * Create an ISO 19115 Point of Contact from an application organisation object
   *
   * The application organisation is a superset of an ISO point of contact and has more specific properties which are
   * mapped to available ISO equivalents (e.g. the schema of the linked identifier is mapped to a generic 'title').
   *
   * The role of the point of contact is (logically) always 'distributor' in this context.
   */
  return {
    organisation: {
      name: org.name,
      href: org.ror,
      title: 'ror',
    },
    phone: org.phone,
    address: org.address,
    email: org.email!,
    online_resource: org.online_resource,
    role: ['distributor'],
  }
}

export const getDistributorOrgSlug = (
  resourceType: ResourceType,
  licence: Licence
): string | null => {
  /*
   * Determine which team will act as the distributor for a resource
   *
   * Implements logic from https://gitlab.data.bas.ac.uk/MAGIC/data-management/-/issues/41 which depends on whether the
   * resource is a dataset and whether it's under a closed licence.
   *
   * If an open dataset:
   * - the distributor is the PDC
   * If an open or closed product:
   * - the distributor is MAGIC
   * Otherwise:
   * - the distributor is unknown/null
   *
   * Returns the slug of the distributor organisation, which can be retrieved using `getOrganisation()`, or `null`.
   */
  if (resourceType == ResourceType.Dataset && licence.open) {
    return getOrganisation('nerc_eds_pdc').slug
  } else if (resourceType == ResourceType.Product) {
    return getOrganisation('bas_magic').slug
  }

  return null
}

export const getFileFormat = (file: File): Format => {
  /*
   * Determine the format of a file from its media type and extension
   *
   * The media type is preferred but often limited for the types of files we handle (e.g. GeoPackages). Where unknown,
   * the file extension is used instead.
   *
   * Where a format can't be determined, an error is thrown as this app intentionally does not support all file types.
   */

  // 'latin_music_continues.foo.bar.baz' => '.foo.bar.baz'
  const fileExt = `.${file.name.split('.').slice(1).join('.')}`

  let format = getFormatByType(file.type)
  if (format) return format
  format = getFormatByExtension(fileExt)
  if (format) return format

  throw new Error(`Cannot determine format.`)
}

export const createDistributionOption = (
  format: Format,
  onlineResource: OnlineResource,
  org: Organisation,
  sizeBytes: number = 0
): DistributionOption => {
  /*
   * Construct an ISO 19115 Distribution Option
   *
   * Combines:
   * - a file format (with optional version)
   * - an online resource (URL)
   * - a distributor (organisation)
   * - an optional file size (in bytes)
   *
   * Underpins functions for file or service distribution options, which should be used instead of this function.
   */
  const distributionOption: DistributionOption = {
    format: {
      format: format.name,
      href: format.url,
    },
    transfer_option: {
      online_resource: onlineResource,
    },
    distributor: createDistributor(org),
  }

  if (format.version) {
    distributionOption.format!['version'] = format.version
  }

  if (sizeBytes) {
    distributionOption.transfer_option['size'] = {
      magnitude: sizeBytes,
      unit: 'bytes',
    }
  }

  return distributionOption
}

export const createDownloadDistributionOption = (
  file: File,
  endpoint: string,
  org: Organisation
): DistributionOption => {
  /*
   * Create an ISO 19115 Distribution Option for a file download
   *
   * Wrapper for `createDistributionOption()`.
   */
  const fileFormat = getFileFormat(file)

  const onlineResource: OnlineResource = {
    href: endpoint,
    title: fileFormat.name,
    description: `Download information as ${fileFormat.description}`,
    function: 'download',
  }

  return createDistributionOption(fileFormat, onlineResource, org, file.size)
}

export const createServiceDistributionOption = (
  service: Service,
  endpoint: string,
  org: Organisation
): DistributionOption => {
  /*
   * Create an ISO 19115 Distribution Option for a service linkage
   *
   * Wrapper for `createDistributionOption()`.
   */
  const serviceFormat: Format = getFormat(service.slug)

  const onlineResource: OnlineResource = {
    href: endpoint,
    title: service.name,
    description: service.description,
    function: 'download',
  }

  return createDistributionOption(serviceFormat, onlineResource, org)
}
