# ⚡️Zap

A prototype metadata editor for MAGIC discovery and administration metadata.

## Overview

> [!NOTE]
> This project is focused on needs within the British Antarctic Survey. It has been open-sourced in case parts are of
> interest to others. Some resources, indicated with a '🛡' or '🔒' symbol, can only be accessed by BAS staff or
> project members respectively. Contact the [Project Maintainer](#project-maintainer) to request access.

### Status

This branch is a work in progress rewrite of the [VueJS](https://vuejs.org/) editor (tracked in `main`) as a
[Streamlit](https://streamlit.io/) application.

> [!IMPORTANT]
> This rewrite does not support:
>
> - creating new records
> - editing existing records
> - importing existing records signed with real admin metadata keys (as test keys are used)

## Supported standards

- ISO 19115, as per the
  [BAS ISO 19115 JSON Schema](https://metadata-standards.data.bas.ac.uk/standards/iso-19115-19139/#json-schemas) and
  [BAS Metadata Library](https://github.com/antarctica/metadata-library?tab=readme-ov-file#supported-standards) subset

## Supported profiles

- [MAGIC Discovery V2](https://metadata-standards.data.bas.ac.uk/profiles/magic-discovery/v2/)
- [MAGIC Administration V1](https://metadata-standards.data.bas.ac.uk/profiles/magic-administration/v1/)

## Supported features

- importing and exporting records as BAS ISO 19115 JSON encoded files
- outputting decrypted optionally embedded MAGIC administration metadata within a record
- previewing a record as an BAS Data Catalogue (Lantern 🏮) HTML item
- validating the current record against:
  - the BAS ISO 19115 JSON schema
  - BAS Data Catalogue (Lantern 🏮) record requirements
  - the MAGIC Discovery and Administration metadata profiles

## Usage

https://zap-exp.streamlit.app/ (app may need to wake up 😴)

## Related projects

- [Lantern 🏮 (🛡️)](https://gitlab.data.bas.ac.uk/MAGIC/lantern-exp) - an experimental data catalogue for BAS discovery
  metadata
- [BAS Metadata Standards 🛡](https://gitlab.data.bas.ac.uk/uk-pdc/metadata-infrastructure/metadata-standards) -
  metadata standards policy and coordination within BAS
- [BAS Metadata Library 🛡](https://gitlab.data.bas.ac.uk/uk-pdc/metadata-infrastructure/metadata-library) - Python
  library to encode and decode metadata records
- [MAGIC Data Management 🛡](https://gitlab.data.bas.ac.uk/MAGIC/data-management) - data management coordination and
  task tracking within MAGIC

## Architecture

See [Architecture](/docs/architecture.md) for a high level description of how this project works.

## Development

See [Development](/docs/dev.md) documentation.

## Project maintainer

Mapping and Geographic Information Centre ([MAGIC](https://www.bas.ac.uk/teams/magic)), British Antarctic Survey
([BAS](https://www.bas.ac.uk)).

Project lead: [@felnne](https://www.bas.ac.uk/profile/felnne).

## Data protection

A Data Protection Impact Assessment (DPIA) is not in place for this project.

## Licence

Copyright (c) 2021-2026 UK Research and Innovation (UKRI), British Antarctic Survey (BAS).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
