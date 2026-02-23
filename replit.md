# FrameWatch

A React + Vite single-page application for an automated identity defense platform. The site is a marketing/landing page with animated matrix-style backgrounds, scroll-based animations, and detection algorithm visualizations.

## Tech Stack
- **Frontend**: React 18, Vite 5
- **Language**: JavaScript (JSX)
- **Styling**: Plain CSS (`src/styles.css`)

## Project Structure
- `index.html` - Entry HTML file
- `src/main.jsx` - Single-file React application with all components
- `src/styles.css` - All styles
- `public/` - Static assets (favicon, logo)
- `vite.config.js` - Vite config (port 5000, host 0.0.0.0, all hosts allowed)

## Running
- Dev: `npm run dev` (port 5000)
- Build: `npm run build` (outputs to `dist/`)

## Deployment
- Configured as a static site deployment with `npm run build` and `dist` output directory.
