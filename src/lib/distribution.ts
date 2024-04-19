import { ResourceType } from '@/types/enum'
import type { Format, Licence, Organisation, Service } from '@/types/app'
import type { DistributionOption, PointOfContact as Contact, OnlineResource } from '@/types/iso'
import { getFormat, getFormatByExtension, getFormatByType } from '@/lib/data'
import { createOrgPointOfContact } from '@/lib/contacts'

export const createDistributor = (org: Organisation): Contact => {
  /*
   * Create an ISO 19115 Point of Contact from an application organisation object
   *
   * Application organisation objects are supersets of an ISO Point of Contact with more specific properties which
   * are mapped to generic ISO equivalents (e.g. the schema of the linked identifier is mapped to a generic 'title').
   *
   * The role of the Point of Contact is (logically) always 'distributor' in this context.
   */
  return createOrgPointOfContact(org, 'distributor')
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
   * Returns the slug of the distributor organisation or `null` if unknown.
   */
  if (resourceType == ResourceType.Dataset && licence.open) {
    return 'nerc_eds_pdc'
  } else if (resourceType == ResourceType.Product) {
    return 'bas_magic'
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
  format: Format,
  url: string,
  org: Organisation,
  sizeBytes: number = 0
): DistributionOption => {
  /*
   * Create an ISO 19115 Distribution Option for a download
   *
   * Wrapper for `createDistributionOption()`.
   */
  const onlineResource: OnlineResource = {
    href: url,
    title: format.name,
    description: `Download information as ${format.description}`,
    function: 'download',
  }

  return createDistributionOption(format, onlineResource, org, sizeBytes)
}

export const createServiceDistributionOption = (
  service: Service,
  url: string,
  org: Organisation
): DistributionOption => {
  /*
   * Create an ISO 19115 Distribution Option for a service linkage
   *
   * Wrapper for `createDistributionOption()`.
   */
  const serviceFormat: Format = getFormat(service.slug)

  const onlineResource: OnlineResource = {
    href: url,
    title: service.name,
    description: service.description,
    function: 'download',
  }

  return createDistributionOption(serviceFormat, onlineResource, org)
}
