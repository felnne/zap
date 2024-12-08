# Zap ⚡️ - Change log

## [Unreleased]

### Added

* 'removed' issue component state
* loading component for lazy loading Record component
* support for determining whether PDF downloads are georeferenced
* additional date types (creation, revision, released)
* support for custom media types (GeoPDF, zipped ShapeFile etc.)
* initial record export component

### Changed

* Refactoring Table of Contents and SectionTitle/SectionBorder base components into types
* Updating to ISO v4 and MAGIC Discovery v1 record schemas
* Reorganise static components separately from base components
* upgrading dependencies
* Simplifying default edition

### Removed

* Research topics component
* Esri identifier (as not a 1:1 mapping)
* WMS service (as no longer supported, replaced with placeholder to ensure services section still works)

## [0.10.4] - 2024-10-18

## Fixed

* Unmatched quote in packaging before task in CD

## [0.10.3] - 2024-10-18

## Fixed

* Missing yaml anchor for packaging before task in CD

## [0.10.2] - 2024-10-18

## Fixed

* Branch rules for review app stop task
* Typo in yaml anchor for packaging before task in CD

## [0.10.1] - 2024-10-18

### Fixed

* CD for tagged releases

## [0.10.0] - 2024-10-17

### Added

* ButtonUpload base component
* DownloadSAN component
* DownloadSwitcher component
* Border to easily identify runtime environment (local development, production, etc.)
* Contextual prologue based on app environment
* JSON Schemas for data files
* Node validation script for data files
* Links to data files in section title base component
* Dependant sections in section title base component
* Data file link in section title base component
* Drop-down menu base component
* Link base component now accepts setting additional classes
* Enable screenshot capture in Sentry feedback widget

### Fixed

* incorrect greyscale scheme for MarkDown previews ('slate' rather than 'neutral')
* missing dark mode support for MarkDown previews
* ISO date conversion timezone issues

### Changed

* adding state to upload button in downloads (pending, uploading, uploading, etc.)
* making URL input readonly for file based downloads
* splitting Download component into Download and DownloadFile components
* streamlining how distributors are made
* refactoring Status enum from RecordValidation component to an app wide ValidationStatus enum
* adjusting for `basweb` HTTPS support
* splitting e2e tests into smaller files
* using Vitest fake timers support for dates section testing
* upgrading dependencies (x2)
* upgrading to eslint v9 (flat config)
* upgrading to vitest 2.x
* upgrading to Metadata Library ISO 19115 v4 config (removing local modifications but using local mirror)

### Removed

* Vite build environment from app environment info (as this was misleading)

## [0.9.0] - 2024-04-14

### Added

* ISO Record object (alongside existing App Record) to give a complete record for validation
* record validation component expanded to validate all sections in current record
* e2e tests for record validation
* ID attribute support in markdown component/base

### Fixed

* invalid lineage structure (missing statement element)
* invalid extent structure (missing 'bounding' identifier)
* accessing ArcGIS view before ready in 2d extent map
* various small eslint warnings

### Changed

* large scale refactoring, all sections emit ISO outputs for assembling into combined ISO Record object
* large scale refactoring, renaming `utils` to `lib` better reflecting their purpose
* large scale refactoring, sections moved under components, divided into _info_ and _element_
* large scale refactoring, record sections split out of app component into new _Record_ composition component and lib
* aligning methods used to create ISO points of contact (between record metadata, distributors and authors)
* significant refactoring and aligning of data used for testing validation section
* improved styles for validation status
* NPM tasks updated to streamline running all linting tools locally
* disabling Sentry plugin in local development

## [0.8.1] - 2024-04-01

### Changed

* updating VSCode recommendations to avoid deprecated extensions
* updating Node packages to latest versions

## [0.8.0] - 2024-02-18

### Added

* URL parameter for downloads allowing transfer option href to be configured
* basic support for uploading files to a staging area for downloads

### Fixed

* e2e tests missing from linting/formatter tasks
* identifier schema/type used incorrect term ('title' instead of 'namespace')

### Changed

* updating app dependencies

## [0.7.0] - 2024-02-04

### Added

* Access restrictions section
* Tailwind plugin for Prettier to sort class names consistently
* 'Author' subtitle to contacts section to reflect contact role
* Record validation section using JSON schema validation
* BAS Research Topic section
* CRS added to spatial extent
* 2D map showing selected extent as it would appear in other catalogues
* 3D map showing selected extent as it naturally appears
* External services section for signing into initially ArcGIS Online
* Script to clean up unused deployments

### Fixed

* Clarifying types/structure for event emit tests
* Incorrect font family class applied to root element (`font-sans-serif` instead of `font-sans`)

### Changed

* Licences now classified by whether they are 'open' or not
* Licences now filtered by access restriction (open/closed)
* Prettier config (commas)
* Extending output core component to allow copy button to be disabled
* Table of Contents items now teleported from SectionTitle into TOC container, avoiding duplicate listings
* Guidance text now uses brand colour (orange)
* Resource type and licence now determine publisher and distributor, inc. whether DOI option shown
* Output component height can now be overridden
* `utils.contacts.createContact` renamed as `createAuthor` to better reflect purpose

## [0.6.1] - 2024-01-07

### Fixed

* Missing spacing around first build info separator

###

* Release/tag element from build info (as this would never be set)

## [0.6.0] - 2024-01-07

### Added

* IDs and classes for selecting specific elements needed for tests
* Initial tests (unit and e2e using Vitest and Playwright)
* Sentry error tracking and user feedback collection
* Static health check endpoint (`heartbeat.txt`)
* Version and stability metadata for section components
* Typing for event emits and handlers
* Collection resource type
* Logic to hide sections that don't apply to different resource types
* GitLab identifier

### Fixed

* Changing slugs for licences in data files to remove characters that can't be used in IDs
* Including slugs as properties in data files for consistency
* Using valid values for identifying individuals and licences (i.e. the value ID attributes are based on)
* Missing event emission for changes to Esri identifier value
* Allowing identifiers with changing values to be correctly updated
* Setting missing index prop for downloads
* Typo in CC licence statement
* Wrong property used for setting licence output (name instead of statement)
* Fixing/tweaking citation utils classes
* Typo in ToC anchor not matching section title anchor
* Spacing for lists of radio and checkbox inputs

### Changed

* Major refactoring of dates component, extracting logic to utils and updating related types
* Sentry disabled in development environment
* Data loading functions refactored into utils module and refactored to return consistent data structures
* external data files aligned to use snake case slugs
* Refactored citation section to use a record instance as a single prop
* Refactored resource type to use an enum
* Refactored ideas into a data file and adding cancelled state
* Refactored build information out of epilogue component into utils module
* Refactored point of contact construction to utils module from contacts component
* Refactored usage constraint construction to utils module from licence component
* Minor refactoring for citation component to remove unnecessary null identifier logic
* Refactored service component to generate distribution option via util functions
* Refactored download component to generate distribution option via util functions
* Refactored download component to determine distribution format via media-type where available
* Selecting relevant distributor organisation based on resource type
* Refactored formats to make version optional
* Refactored setting like values/constants to settings data file

## [0.5.3] - 2023-12-30

### Fixed

- Incorrect rules for linting CI task (again!)

## [0.5.2] - 2023-12-30

### Fixed

- Incorrect rules for review apps CD task

## [0.5.1] - 2023-12-30

### Fixed

- Prettifier formatting errors
- Incorrect rules for linting CI task

### Improved

- Continuous Deployment workflow

## [0.5.0] - 2023-12-30

### Fixed

- Back to top link moved to a component and no longer effects page layout
- Including missing link to Markdown reference

### Changed

- Updating branding
- Review apps now use a `review-` prefix rather than a `review` subdirectory
- Skipping `lint` CI task for tags in CI
- Tweaking Prologue component language
- Refactoring links into a `Link` base component
- Refactoring guidance text into a `GuidanceText` base component
- Refactoring buttons into a `Button` base component
- Refactoring section subtitles into a `SectionTitle` component
- Refactoring form labels into a `FormLabel` component
- Refactoring labels within sections (e.g. input and preview) into a `SectionLabel` component
- Refactoring prose HTML output sections into a `Prose` component
- Refactoring text areas into a `FormTextarea` component
- Refactoring non-radio/checkbox form inputs into a `FormInput` component
- Refactoring section wrappers into a `SectionBorder` component
- Refactoring section components to separate (sections) module
- Upgrading Vue.js to 3.4 and other dependencies to latest versions
- Refactoring spacing classes to a consistent set of values
- Refactoring two column layout into a `TwoColumn` component
- Refactoring colour classes to a consistent set of values
- Refactoring subsection wrappers into a `SubSectionBorder` component
- Switching from `gray` to `neutral` Tailwind greyscale pallet
- Using `@/` path alias for component imports
- Renaming `Freetext` component to `Markdown` to better reflect purpose
- Refactoring element variables in `App` component into `Record` type

## [0.4.0] - 2023-12-27

### Added

- Identifiers for BAS Data Catalogue, DOI and Esri
- Citation element, including CrossCite API and locally generated APA formatted initial values
- Publication date element
- Edition element
- Resource type element
- Epilogue meta section
- Initial CI pipeline

### Changed

- Preface meta section renamed to Prologue to fit with new Epilogue section

### Removed

- In-app change log section

### Fixed

- Spacing in two column and freetext components

### Changed

- Refactored Identifiers component (using sub-components per Identifier scheme)

## [0.3.0] - 2023-12-26

### Added

- Basic Table of Contents component
- Example of guidance for sections
- Initial dark mode support

### Changed

- Improved layout and UI polish (spacing etc.)
- Freetext component refactored into separate Title, Abstract and Lineage components
- typeScript types refactored into standalone modules to prevent duplication and inconsistency

## [0.2.0] - 2023-12-24 [BREAKING!]

### Removed [BREAKING!]

- Complete config listing appendix

### Changed [BREAKING!]

- General app rewrite, including code and UI
- Upgrading to Vue 3.x
- Switching to Vite
- Rewriting Transfer Options section to read size and format from local file
- Replacing Docker & Docker Compose with NVM
- Replacing `vue-simple-markdown` with `markdown-it` due to lack of Vue 3 support

### Added

- Adding Typescript, ESlint, Prettier

## [0.1.0] - 2021-07-12

### Added

- Initial version
