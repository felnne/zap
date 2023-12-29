# Zap ⚡️ - Change log

## [Unreleased]

### Fixed

- Back to top link moved to component and no longer effects page layout

### Changed

- Updating branding
- Review apps now use a a `review-` prefix rather than a `review` sub-directory
- Skipping `lint` CI task for tags in CI
- Tweaking Prologue component language
- Refactoring links into a `Link` base component

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
