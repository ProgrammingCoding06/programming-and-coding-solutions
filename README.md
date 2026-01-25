Landing page scaffold for a small business

How to use

1. Install dependencies:

```powershell
cd "c:/Users/madle/Desktop/programming-and-coding-solutions"
npm install
```

2. Run dev server:

```powershell
npm run dev
```

3. Build for production:

```powershell
npm run build
```

Where to place Figma assets

- Put images in `public/assets/` and reference them from `/assets/` in the code.
- Update `src/styles.css` to match fonts/colors from Figma.

SEO and deployment tips

- Ensure `index.html` has a descriptive title and meta description (already added).
- Add Open Graph and Twitter card meta tags so links share with a preview image (`public/assets/social-preview.png`).
- Keep `robots.txt` and `sitemap.xml` in `public/` and ensure they reference the correct production domain.
- Use descriptive alt text for images and semantic HTML for better indexing.
- Use structured data (JSON-LD) for LocalBusiness (already added) and verify with Google's Rich Results Test.
- Deploy to a reliable host (Netlify, Vercel, or similar) and connect your domain. After deployment, submit your sitemap to Google Search Console.

Contact & social

- Phone: +44 7783 597186
- Instagram: https://www.instagram.com/pr_remaps

If you'd like, I can:
- Generate optimized image assets from your Figma exports.
- Configure a simple GitHub Actions workflow to deploy to Netlify/Vercel automatically.
- Run accessibility and SEO checks and produce a short report.

Running Lighthouse locally

To run a Lighthouse audit locally you'll need Chrome or Chromium installed. On Windows you can install Chrome from Google or use a Chromium build.

Once Chrome is installed, start the dev server and run:

```powershell
npm run dev
npx -y lighthouse http://localhost:5174/ --output html --output-path lighthouse-report.html
```

This generates a human-readable `lighthouse-report.html` you can open in your browser.
