# Zap ⚡️ - Change log

## [Unreleased]

### Added

* Initial tests (unit and e2e using Vitest and Playwright)
* Sentry error tracking and user feedback collection

### Fixed

* Changing slugs for licences in data files to remove characters that can't be used in IDs
* Including slugs as properties in data files for consistency
* Using valid values for identifying individuals and licences (i.e. the value ID attributes are based on)

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

## v0.1.0 - 2021-07-12
## [0.1.0] - 2021-07-12

### Added

- Initial version
