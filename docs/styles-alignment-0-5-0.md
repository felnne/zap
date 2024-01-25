# App Styles Review (v0.5.0)

And amended for:

- v0.6.0

Focus:

- [spacing](#spacing)
- [font sizes](#font-size)
- [colours]()

## Spacing

### Margin

| M | MX | MY | MB | ML | MR | MT |
|---|----|----|----|----|----|----|
| - | -  | -  | 2  | -  | -  | -  |
| - | -  | -  | -  | -  | -  | -  |
| - | -  | -  | 10 | -  | -  | -  |

Removed:

- `mb-5` now `space-y-4` (section)
- `ml-4` now `space-x-4` (app title)
- `mr-2` now `space-x-2` (idea)
- `mt-4` now `space-y-4` (ideas)

Remaining:

- `mb-2` only used once for section label (hint text), all other instances `space-y-2`
- `mb-10` only used in app title and citation

### Padding

| P  | PX | PY | PB | PL | PR | PT |
|----|----|----|----|----|----|----|
| -  | -  | 1  | -  | -  | -  | -  |
| 2  | 2  | -  | -  | -  | -  | -  |
| 4  | -  | -  | -  | -  | -  | -  |
| 10 | -  | -  | -  | -  | -  | -  |

Removed:

- `p-5` now `p-4`
- `pl-2` now `space-x-4`
- `pr-2` now `space-x-4`

Remaining:

- `p-2` used for prose, downloads and services (i.e. subsections)
- `p-4` only used once in section border
- `p-10` only used once for main app component
- `px-2` used for idea instances and buttons
- `py-1` used for idea instances and buttons

### Height

Remaining:

- `h-28` only used once for app title

### Min height

Removed:

- `min-h-60` used for large freetext inputs (abstract, citation, lineage), now freetext component default

Remaining:

- `min-h-10` used once for small freetext inputs(title)

### Max height

Remaining:

- `max-h-96` used for outputs (contacts, download, service), now refactored to default class in output component

### Width

Remaining:

- `w-14`, `w-16` used for dates (month/day, year / 2 vs 4 digits)

### Gap

Removed:

- `gap-2` was used in table of contents, now `gap-4`

Remaining:

- `gap-4` used for grid in table of contents and right aligned elements of section titles

### Gap X

Removed:

- `gap-x-2` now `space-x-4` (used in date component to give better separation between parts and part labels)

### Gap Y

Removed:

- `gap-y-2` not sure what this was but is no longer used

### Space X

Remaining:

- `space-x-2`, `space-x-4` used extensively

### Space Y

Remaining:

- `space-y-2`, `space-y-4` used extensively

### Border

Removed:

- `file:border` now removed (will be normalised later)

Remaining:

- `border-2` used for subsections
- `border-4` used for sections

## Font size

Remaining:

- `text-xs` used for idea badges and buttons
- `text-xl` used for section subtitles
- `text-2xl` used for section titles
- `text-3xl` used for app title

Additional [0.6.0]:

- `text-[8px]` used for section version/stability

## Colours

Following rationalisation.

### Main

- default colour pallet: `neutral`
- aside colour pallet: `sky`

| Aspect             | Purpose              | Uses                           | Colour (Light)    | Colour Dark    |
|--------------------|----------------------|--------------------------------|-------------------|----------------|
| Background         | Default              | -                              | `white`           | `black`        |
| Text               | Default              | -                              | `black`           | `white`        |
| Border             | Aside                | Non-element sections, Previews | `sky-500`         | `sky-500`      |
| Border             | Inputs               | Form fields, buttons           | `black`           | `white`        |
| Background         | Inputs               | Form fields, buttons           | `white`           | `black`        |
| Background (Hover) | Inputs               | buttons                        | `neutral-100`     | `neutral-700`  |
| Border             | Outputs              | Code output                    | `black`           | `white`        |
| Background         | Outputs              | Code output                    | `neutral-100`     | `neutral-900`  |
| Border             | Primary boundary     | Sections                       | `neutral-500`     | `neutral-500`  |
| Border             | Secondary boundary   | Subsections, Divisions         | `neutral-300`     | `neutral-700`  |
| Text               | Secondary boundary   | Subtitles, Divisions           | `neutral-500`     | `neutral-500`  |
| Background         | Non-interactivity    | Disabled form fields, buttons  | `neutral-100`     | `neutral-700`  |
| Background         | Contextual (Info)    | Badges                         | `sky-50`          | `sky-950`      |
| Text               | Contextual (Info)    | Badges                         | `sky-500`         | `sky-500`      |
| Background         | Contextual (Success) | Badges, Validity               | `green-50`        | `green-950`    |
| Text               | Contextual (Success) | Badges, Validity               | `green-500`       | `green-500`    |
| Text               | Contextual (Error) | Validity                         | `red-500`         | `red-500`      |

### Extras

- experimental warning: `amber-500` (border only, same for dark mode)
- hyperlinks: `blue-700` (text only, `blue-500` for dark mode)
- help/guidance text: `emerald-700` (text only, `emerald-500` for dark mode)
- preview hints/labels: `sky-500` (text only, same for dark mode)
- secondary input labels: `neutral-500` (text only, same for dark mode)
- back to top links: `neutral-300` (dark mode background only)

Additional [0.6.0]:

- supported file extensions background: `emerald-900` (dark `emerald-100`)

### Exceptions

- button hover and disabled fields should be `neutral-900` but there's not enough contrast given the small element sizes
