# Charla Living

React, TypeScript, Vite, Tailwind CSS, and shadcn-based migration of the Charla Living website. The original static site remains at the repository root.

## Development

```sh
npm install
npm run dev
```

## Checks

```sh
npm run build
npm run lint
```

## Structure

- `src/components/ui/`: shadcn UI and the skyline hero component.
- `src/components/site/`: converted navigation, content sections, and footer.
- `src/site-interactions.js`: existing site interactions initialized after React mounts.
- `src/site.css`: existing site design system and responsive styles.
- `src/index.css`: Tailwind v4 and shadcn theme tokens.
- `public/bangalore-city-landscape.svg`: supplied transparent skyline used by the hero.
