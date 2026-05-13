# AppShot

AppShot is a free, static, browser-based App Store screenshot generator for iPhone and iPad apps. It runs fully client-side: uploads stay local in the browser, projects are saved in `localStorage`, and exports are generated as PNG or ZIP files without a backend.

## Features

- Guided flow for choosing iPhone or iPad screenshots.
- Start with 1-10 screenshots and edit the count later.
- Per-screenshot upload, title, subtitle, background, frame, layout, typography, spacing, position, scale, and rotation controls.
- Dedicated global settings for shared backgrounds, typography, device defaults, layout defaults, and export size.
- Per-screenshot overrides are resolved against global project defaults so teams can keep a consistent screenshot pack while customizing individual slides.
- iPhone and iPad frame definitions driven by `src/config/devices.ts`.
- App Store export sizes driven by `src/config/appStoreSizes.ts`.
- Layout template definitions driven by `src/config/templates.ts`.
- Live single-screen preview and all-screenshot grid preview.
- Add, duplicate, reorder, and remove screenshots.
- Download the current screenshot, all screenshots as separate PNG files, or all screenshots as a ZIP.
- Project persistence in `localStorage`.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- `html-to-image` for browser-side PNG export
- `jszip` for ZIP export
- `lucide-react` for icons

## Getting Started

```bash
npm install
npm run dev
```

Build the production version:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/
    controls/
    device-frames/
    editor/
    export/
    layout/
    screenshot-card/
  config/
    appStoreSizes.ts
    defaultStyles.ts
    devices.ts
    fonts.ts
    templates.ts
  hooks/
    useImageExport.tsx
    useScreenshotProject.ts
  pages/
    EditorPage.tsx
    LandingPage.tsx
    SetupPage.tsx
  types/
    device.ts
    screenshot.ts
    template.ts
  utils/
    canvasHelpers.ts
    fileHelpers.ts
    imageExport.ts
    slideStyles.ts
```

## GitHub Pages Deployment

This project uses `base: './'` in `vite.config.ts`, so the built app can be hosted from a GitHub Pages project path without hardcoded asset URLs.

### Recommended deployment

This repo includes `.github/workflows/deploy.yml`. Push to `main`, then in GitHub:

1. Open the repository settings.
2. Go to **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Re-run the **Deploy to GitHub Pages** workflow if it does not start automatically.

Do not use “Deploy from branch / root” for this Vite app. That serves the source `index.html`, which points to `/src/main.tsx` and will produce a blank page on GitHub Pages.

### Manual deployment

If you deploy manually, run:

```bash
npm run build
```

Then deploy the generated `dist/` folder, not the repository root.

### GitHub Actions workflow

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## Extension Points

- Add more devices in `src/config/devices.ts`.
- Add accepted output sizes in `src/config/appStoreSizes.ts`.
- Add layout templates in `src/config/templates.ts` and extend `ScreenshotCanvas`.
- Move project state from `useScreenshotProject` to Zustand or another store when collaboration, saved projects, or brand kits are added.
- Extend `GlobalStyle` in `src/types/screenshot.ts` for brand kits, logos, custom fonts, or landscape defaults.
- Add landscape support by extending `AppStoreSize`, `ScreenshotSlide`, and the template renderer.
