# Gallery Data Contract

## Source

Gallery data lives at `public/data/gallery.json`.

## Required Fields

- `id`
- `src`
- `thumbSrc`
- `alt`
- `location`
- `year`
- `category`
- `width`
- `height`

## Optional Fields

- `title`
- `date`
- `camera`
- `lens`
- `ratio`
- `dominantColor`

## Validation Rules

- Payload must be an array.
- `id` must be unique.
- Required text fields must be non-empty strings.
- `width` and `height` must be positive numbers.
- `ratio`, when present, must be `landscape`, `portrait`, or `square`.
- Image paths should point to project public assets.
