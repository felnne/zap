import { ResourceType } from '@/types/enum'
import type { Format, Licence, Service } from '@/types/app'
import type { DistributionOption, PointOfContact as Contact, OnlineResource } from '@/types/iso'
import { getFormat, getFormatByExtension, getFormatByType, getOrganisation } from '@/lib/data'
import { createOrgPointOfContact } from '@/lib/contacts'

export const createDistributor = (resourceType: ResourceType, licence: Licence): Contact => {
  /*
   * Create an ISO 19115 Point of Contact for the organisation determined to act as the distributor for a resource
   *
   * Implements logic from https://gitlab.data.bas.ac.uk/MAGIC/data-management/-/issues/41 which depends on:
   * - the resource type (whether the resource is a dataset)
   * - the licence and in turn access constraint (whether the resource is open access or not)
   *
   * If an open access dataset:
   * - the distributor is the PDC
   * Otherwise:
   * - the distributor is MAGIC
   *
   * Returns an ISO Point of Contact a role of 'distributor'.
   */
  let orgSlug = 'bas_magic'
  if (resourceType == ResourceType.Dataset && licence.open) {
    orgSlug = 'nerc_eds_pdc'
  }

  return createOrgPointOfContact(getOrganisation(orgSlug), 'distributor')
}

export const getFormatString = (file: string): Format => {
  /*
   * Determine the format of a file, expressed as a string/path, from its extension
   *
   * Where a format can't be determined, an error is thrown as this app intentionally does not support all file types.
   *
   * Example:
   * - '/data/foo/latin_music_continues.foo.bar.baz'
   * - 'https://example.com/image.png' => 'image.png'
   *
   * Output:
   * > '.foo.bar.baz'
   * > '.png'
   */
  const path = file.split('/').pop() || file
  const fileExt = `.${path.split('.').slice(1).join('.')}`

  const format = getFormatByExtension(fileExt)
  if (format) return format

  throw new Error(`Cannot determine format.`)
}

export const getFormatFile = (file: File): Format => {
  /*
   * Determine the format of a file, expressed as a browser File object, from its media type and extension
   *
   * The media type is preferred but often limited for the types of files we handle (e.g. GeoPackages). Where unknown,
   * the file extension is used instead.
   *
   * Where a format can't be determined, an error is thrown as this app intentionally does not support all file types.
   */
  const format = getFormatByType(file.type)
  if (format) return format

  return getFormatString(file.name)
}

export const createDistributionOption = (
  format: Format,
  onlineResource: OnlineResource,
  distributor: Contact,
  sizeBytes: number = 0
): DistributionOption => {
  /*
   * Construct an ISO 19115 Distribution Option
   *
   * Combines:
   * - a file format (with optional version)
   * - an online resource (URL)
   * - a distributor (ISO Point of Contact)
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
    distributor: distributor,
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
  distributor: Contact,
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

  return createDistributionOption(format, onlineResource, distributor, sizeBytes)
}

export const createServiceDistributionOption = (
  service: Service,
  url: string,
  distributor: Contact
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

  return createDistributionOption(serviceFormat, onlineResource, distributor)
}
