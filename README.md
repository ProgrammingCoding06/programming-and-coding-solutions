# PR REMAPS website

React/Vite website for Programming & Coding Solutions / PR REMAPS.

## Local development

```powershell
npm install
npm run dev
```

## Production build

```powershell
npm run build
npm run preview
```

The build outputs to `dist/` and includes both:

- `/`
- `/privacy-policy.html`

## Content and assets

- Main page sections live in `src/App.jsx`.
- The Framer MCP code component is adapted in `src/components/StarRating.jsx`.
- Global styling lives in `src/styles.css`.
- Replace images in `public/assets/` and keep the same filenames to avoid code changes.

## Deployment

This project is ready for Vercel or any static host that serves the Vite `dist/` output. Security
headers are configured in `vercel.json`, and Netlify-style headers remain in `public/_headers`.

Run checks before deployment:

```powershell
npm run lint
npm run build
```
