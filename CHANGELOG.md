# Zap ⚡️ - Change log

## [Unreleased]

### Added

* ButtonUpload base component

### Changed

* adding state to upload button in downloads (pending, uploading, uploading, etc.)
* making URL input readonly for file based downloads
* splitting Download component into Download and DownloadFile components
* streamlining how distributors are made
* refactoring Status enum from RecordValidation component to an app wide ValidationStatus enum
* adjusting for basweb HTTPS support
* splitting e2e tests into smaller files

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
